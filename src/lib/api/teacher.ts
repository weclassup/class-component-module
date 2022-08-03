import { teacherClassAPI } from "./class.api";
import keys from "../json/key.name.json";
import { BasicUserInformation, S3File } from "../index";

export interface TeacherSignUpPayload
  extends Omit<BasicUserInformation, "id" | "profilePicture" | "email"> {
  customSchoolDepartmentName?: string;
  customSchoolName?: string;
  currentJobLocation?: string;
  degreeId?: number;
  degreeImageId?: number;
  degreeSchoolDepartmentId?: number;
  degreeSchoolId?: number;
  degreeSchoolCityId?: number;
  emailValidationCode: string;
  emailValidationToken: string;
  mainVerificationImageId?: number;
  otherProveFileIds: (number | undefined)[];
  phoneValidationCode: string;
  phoneValidationToken: string;
  pwd: string;
  selfIntroduction: string;
  specializeSubjectIds: number[];
  studentCardOrTranscriptImageId?: number;
  teacherLicenseImageId?: number;
  promoteCode: string;
}

export interface TeacherSignUpFormValues
  extends Omit<TeacherSignUpPayload, "birthday"> {
  email: string;
  confirmPassword: string;
  phone: string;
  isPhoneConfirmed: boolean;
  profilePicture: File | S3File | undefined;
  mainVerificationImage: File | S3File | undefined;
  acceptPolicy: boolean;
  degreeImage: File | S3File | undefined;
  otherProveFiles: (File | S3File | undefined)[];
  studentCardOrTranscriptImage: File | S3File | undefined;
  teacherLicenseImage: File | S3File | undefined;

  birthYear: string;
  birthMonth: string;
  birthDate: string;
}

export interface TeacherProfileUpdatePayload
  extends Omit<
    TeacherSignUpPayload,
    | "emailValidationCode"
    | "emailValidationToken"
    | "phoneValidationCode"
    | "phoneValidationToken"
    | "pwd"
  > {}

// POST
interface PostToIssueTeacherSignUp {
  (payload: string): Promise<{ validationToken: string }>;

  (payload: {
    emailValidationCode: string;
    emailValidationToken: string;
    phone: string;
  }): Promise<{
    phoneValidationToken: string;
  }>;
}

export const postToIssueTeacherSignUp: PostToIssueTeacherSignUp = async (
  payload: any
): Promise<any> => {
  if (typeof payload === "string") {
    const { data } = await teacherClassAPI.post<{
      validationToken: string;
    }>(`/api/p/emailValidation/teacher`, { email: payload });

    return data;
  } else if (typeof payload === "object") {
    const { data } = await teacherClassAPI.post<{
      phoneValidationToken: string;
    }>(`/api/p/phoneValidation/teacher`, payload);

    return data;
  }
};

export const postToVerifyCode = async (
  type: "email" | "phone",
  code: string,
  validationToken: string
) => {
  if (type === "email") {
    await teacherClassAPI.post(
      `/api/p/emailValidation/verify`,
      {
        code,
        validationToken,
      },
      { showErrorAlert: true }
    );
  }
  if (type === "phone") {
    await teacherClassAPI.post(
      `/api/p/phoneValidation/verify`,
      {
        code,
        validationToken,
      },
      { showErrorAlert: true }
    );
  }
};

export const postToSignInTeacher = async (email: string, pwd: string) => {
  const {
    data: { token },
  } = await teacherClassAPI.post<{ token: string }>(
    `/api/p/auth/teacher/signIn`,
    { email, pwd }
  );
  window.localStorage.setItem(keys.TEACHER_ACCESS_TOKEN, token);
};

export const postToSignUpTeacher = async (formValues: TeacherSignUpPayload) => {
  const {
    data: { token },
  } = await teacherClassAPI.post<{ token: string }>(
    `/api/p/auth/teacher/signUp`,
    formValues,
    { showErrorAlert: true }
  );
  window.localStorage.setItem(keys.TEACHER_ACCESS_TOKEN, token);
};

export const postToIssueForgotPassword = async (email: string) => {
  await teacherClassAPI.post(`/api/p/auth/teacher/forgetPwd`, { email });
};

// PUT
export const putToCommitPasswordReset = async (pwd: string, token: string) => {
  await teacherClassAPI.put(`/api/p/auth/teacher/commitPwdReset`, {
    pwd,
    token,
  });
};

export const putToUpdateTeacherPendingProfile = async (
  payload: TeacherProfileUpdatePayload
) =>
  await teacherClassAPI.put(`/api/t/me/pendingProfile`, payload, {
    showErrorAlert: true,
  });

export const putToCommitTeacherProfile = async () =>
  await teacherClassAPI.put(
    `/api/t/me/commitProfile`,
    {},
    { showErrorAlert: true }
  );
