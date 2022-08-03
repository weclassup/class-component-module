import { loadingEventEmitter } from "../events/class.event";
import { studentClassAPI, teacherClassAPI } from "../api/class.api";
import { AxiosRequestConfig } from "axios";
import { isAry, isNotSet, isSet } from "./format.checker";
import { IssueBeforeSignUpConfig, IssueUploadResponse, S3File } from "..";

export class FileUploader {
  constructor(
    private userType: AuthType,
    // private relateTypeId: number,
    private issueBeforeSignUpConfig?: Omit<
      IssueBeforeSignUpConfig,
      "commitFileUploadReq" | "issueFileUploadReq"
    >
  ) {}

  async getResult(file: File | S3File | undefined): Promise<S3File | undefined>;

  async getResult(
    files: (undefined | File | S3File)[]
  ): Promise<(S3File | undefined)[]>;

  async getResult(
    files: (File | S3File | undefined)[] | File | S3File | undefined
  ) {
    loadingEventEmitter.emit(true);
    let result: S3File | (S3File | undefined)[] | undefined;
    if (isAry(files)) {
      result = await Promise.all(files.map((file) => this.startUpload(file)));
    } else {
      result = await this.startUpload(files);
    }
    loadingEventEmitter.emit(false);
    return result;
  }

  private async postToIssueUpload(file: File) {
    if (!checkUserAuthorizationType(this.userType)) throw AuthorizationError;

    let body:
      | IssueBeforeSignUpConfig["issueFileUploadReq"]
      | Omit<IssueBeforeSignUpConfig, "commitFileUploadReq"> = {
      contentDisposition: `attachment; filename=${encodeURI(file.name)}`,
      contentType: file.type,
      name: file.name,
      size: file.size,
    };

    if (isSet(this.issueBeforeSignUpConfig)) {
      const issueFileUploadReq = { ...body };
      body = {
        issueFileUploadReq,
        emailValidationCode: this.issueBeforeSignUpConfig.emailValidationCode,
        emailValidationToken: this.issueBeforeSignUpConfig.emailValidationToken,
        phoneValidationCode: this.issueBeforeSignUpConfig.phoneValidationCode,
        phoneValidationToken: this.issueBeforeSignUpConfig.phoneValidationToken,
      };
    }
    const config: AxiosRequestConfig = {
      disableLoader: true,
      showErrorAlert: true,
    };
    if (this.userType === "student") {
      const { data } = await studentClassAPI.post<IssueUploadResponse>(
        `/api/s/file`,
        body,
        config
      );
      return data;
    } else {
      const { data } = await teacherClassAPI.post<IssueUploadResponse>(
        isSet(this.issueBeforeSignUpConfig)
          ? `/api/p/auth/teacher/signUp/file`
          : `/api/t/file`,
        body,
        config
      );
      return data;
    }
  }

  private async putFileToUploadUrl(file: File, uploadUrl: string) {
    if (!checkUserAuthorizationType(this.userType)) throw AuthorizationError;
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename=${encodeURI(file.name)}`,
      },
      disableLoader: true,
      showErrorAlert: true,
    };
    if (this.userType === "student") {
      await studentClassAPI.put(uploadUrl, file, config);
    } else {
      await teacherClassAPI.put(uploadUrl, file, config);
    }
  }

  private async putToCommitUpload(fileId: number) {
    if (!checkUserAuthorizationType(this.userType)) throw AuthorizationError;

    let body:
      | IssueBeforeSignUpConfig["commitFileUploadReq"]
      | Omit<IssueBeforeSignUpConfig, "issueFileUploadReq"> = {
      // relateType: this.userType!.toUpperCase(),
      // relateTypeId: this.relateTypeId,
    };

    if (isSet(this.issueBeforeSignUpConfig)) {
      body = {
        // commitFileUploadReq: {
        // 	relateType: this.userType!.toUpperCase(),
        // 	relateTypeId: this.relateTypeId,
        // },
        commitFileUploadReq: {},
        emailValidationCode: this.issueBeforeSignUpConfig.emailValidationCode,
        emailValidationToken: this.issueBeforeSignUpConfig.emailValidationToken,
        phoneValidationCode: this.issueBeforeSignUpConfig.phoneValidationCode,
        phoneValidationToken: this.issueBeforeSignUpConfig.phoneValidationToken,
      };
    }

    const config: AxiosRequestConfig = {
      disableLoader: true,
      showErrorAlert: true,
    };
    if (this.userType === "student") {
      const { data } = await studentClassAPI.put<S3File>(
        `/api/s/file/${fileId}`,
        body,
        config
      );
      return data;
    } else {
      const { data } = await teacherClassAPI.put<S3File>(
        isSet(this.issueBeforeSignUpConfig)
          ? `/api/p/auth/teacher/signUp/file/${fileId}`
          : `/api/t/file/${fileId}`,
        body,
        config
      );
      return data;
    }
  }

  private async startUpload(file: File | S3File | undefined) {
    if (isNotSet(file)) return undefined;

    if (file instanceof File) {
      const { id, uploadUrl } = await this.postToIssueUpload(file);
      await this.putFileToUploadUrl(file, uploadUrl);
      return await this.putToCommitUpload(id);
    } else {
      return file;
    }
  }
}

export default FileUploader;

const checkUserAuthorizationType = <U>(
  userType: AuthType | U
): userType is AuthType => {
  return !(userType !== "student" && userType !== "teacher");
};

const AuthorizationError = new Error(
  "Please specify the user authorization type: student | teacher"
);
