import { useCallback, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import { teacherClassAPI } from "../api/class.api";
import FileUploader from "../helper/file.uploader";
import keys from "../json/key.name.json";
import history from "../history";
import { S3File } from "..";
import { OptionItemFromServer } from "../api";

export const useTeacherAuth = createContainer(() => {
  const [authType] = useState<AuthType>("teacher");
  const [isSignIn, setIsSignIn] = useState<boolean | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
    null
  );

  const userProfile = useMemo(() => {
    return teacherProfile;
  }, [teacherProfile]);

  const getUserProfile = useCallback(async () => {
    const { data } = await teacherClassAPI.get<TeacherProfile>(`/api/t/me`);
    setTeacherProfile(data);
  }, []);

  const putToUpdateProfilePicture = useCallback(
    async (file: File) => {
      const id = await new FileUploader(
        "teacher"
        // userId || userProfile?.activeProfile.id || 0
      )
        .getResult(file)
        .then((res) => res?.id);

      const { data } = await teacherClassAPI.put<TeacherProfile>(
        `/api/s/me/profilePicture`,
        { profilePictureId: id }
      );
      setTeacherProfile(data);
    },
    [userProfile]
  );

  const signOutHandler = useCallback(() => {
    setTeacherProfile(null);
    setIsSignIn(false);
    window.localStorage.removeItem(keys.TEACHER_ACCESS_TOKEN);
    history.push("/");
  }, []);

  const manualUpdateProfile = useCallback(
    (profile: TeacherProfile) => setTeacherProfile(profile),
    []
  );

  return {
    authType,
    isSignIn,
    userProfile,
    setIsSignIn,
    putToUpdateProfilePicture,
    getUserProfile,
    signOutHandler,
    manualUpdateProfile,
  };
});

export default useTeacherAuth;

export interface TeacherProfile {
  email: string;
  profileStatus: "PROCESSING" | "VERIFIED" | "REJECTED" | "BLOCKED";
  activeProfile?: TeacherActiveProfileDto;
  pendingProfile?: TeacherPendingProfileDto;
  signupSource?: "CLASS" | "EBOOK";
  promoteCode: string;
}

// export interface TeacherBasicProfile
//   extends Omit<
//     TeacherSignUpPayload,
//     | "emailValidationCode"
//     | "emailValidationToken"
//     | "phoneValidationCode"
//     | "phoneValidationToken"
//     | "pwd"
//   > {
//   id: number;
//   degreeImage: S3File;
//   mainVerificationImage: S3File;
//   otherProveFiles: S3File[];
//   phone: string;
//   profilePicture: S3File;
//   studentCardOrTranscriptImage: S3File;
//   teacherLicenseImage: S3File;
//
//   degree: OptionItemFromServer;
//   degreeSchool: OptionItemFromServer;
//   degreeSchoolCity: OptionItemFromServer;
//   degreeSchoolDepartment: OptionItemFromServer;
//   subjects: Array<
//     OptionItemFromServer & {
//       parent: OptionItemFromServer;
//     }
//   >;
// }

export interface TeacherActiveProfileDto {
  phone: string;

  /** ?????? */
  givenName: string;

  /** ?????? */
  surName: string;

  /** ?????? */
  nickName: string;
  gender: "MALE" | "FEMALE" | "OTHER";

  /**
   * ??????
   * @format date-time
   */
  birthday: string;

  /**
   * ??????
   * @format int32
   */
  degreeId?: number;

  /**
   * ??????
   * @format int32
   */
  degreeSchoolId?: number;

  /**
   * ????????????
   * @format int32
   */
  degreeSchoolCityId?: number;

  /**
   * ??????
   * @format int32
   */
  degreeSchoolDepartmentId?: number;

  /** ??????(????????????) */
  customSchoolName?: string;

  /** ??????(????????????) */
  customSchoolDepartmentName?: string;

  /** ???????????? */
  selfIntroduction: string;

  /**
   * ????????????????????????
   * @format int32
   */
  mainVerificationImageId?: number;

  /**
   * ????????????????????????
   * @format int32
   */
  degreeImageId?: number;

  /**
   * ?????????/???????????????????????????
   * @format int32
   */
  studentCardOrTranscriptImageId?: number;

  /**
   * ????????????
   * @format int32
   */
  profilePictureId?: number;

  /**
   * ?????????????????????
   * @format int32
   */
  teacherLicenseImageId?: number;

  /** ??????????????????????????? */
  currentJobLocation?: string;

  /** ???????????? */
  specializeSubjectIds: number[];

  /** ?????????????????????????????? */
  otherProveFileIds: number[];
  profilePicture?: S3File;
  mainVerificationImage?: S3File;
  degreeImage?: S3File;
  teacherLicenseImage?: S3File;
  studentCardOrTranscriptImage?: S3File;
  otherProveFiles: S3File[];
  degree?: OptionItemFromServer;
  degreeSchool?: OptionItemFromServer;
  degreeSchoolCity?: OptionItemFromServer;
  degreeSchoolDepartment?: OptionItemFromServer;
  subjects: Array<
    OptionItemFromServer & {
      parent?: OptionItemFromServer;
    }
  >;
}

export interface TeacherPendingProfileDto {
  /** ?????? */
  givenName: string;

  /** ?????? */
  surName: string;

  /** ?????? */
  nickName: string;
  gender: "MALE" | "FEMALE" | "OTHER";

  /**
   * ??????
   * @format date-time
   */
  birthday: string;

  /**
   * ??????
   * @format int32
   */
  degreeId?: number;

  /**
   * ??????
   * @format int32
   */
  degreeSchoolId?: number;

  /**
   * ????????????
   * @format int32
   */
  degreeSchoolCityId?: number;

  /**
   * ??????
   * @format int32
   */
  degreeSchoolDepartmentId?: number;

  /** ??????(????????????) */
  customSchoolName?: string;

  /** ??????(????????????) */
  customSchoolDepartmentName?: string;

  /** ???????????? */
  selfIntroduction: string;

  /**
   * ????????????????????????
   * @format int32
   */
  mainVerificationImageId?: number;

  /**
   * ????????????????????????
   * @format int32
   */
  degreeImageId?: number;

  /**
   * ?????????/???????????????????????????
   * @format int32
   */
  studentCardOrTranscriptImageId?: number;

  /**
   * ????????????
   * @format int32
   */
  profilePictureId?: number;

  /**
   * ?????????????????????
   * @format int32
   */
  teacherLicenseImageId?: number;

  /** ??????????????????????????? */
  currentJobLocation?: string;

  /**
   * ??????????????????
   * @format date-time
   */
  applyAt?: string;

  /**
   * ???????????????
   * @format date-time
   */
  rejectedAt?: string;
  phone: string;

  /** ???????????? */
  specializeSubjectIds: number[];

  /** ?????????????????????????????? */
  otherProveFileIds: number[];
  profilePicture?: S3File;
  mainVerificationImage?: S3File;
  degreeImage?: S3File;
  teacherLicenseImage?: S3File;
  studentCardOrTranscriptImage?: S3File;
  otherProveFiles: S3File[];
  degree?: OptionItemFromServer;
  degreeSchool?: OptionItemFromServer;
  degreeSchoolCity?: OptionItemFromServer;
  degreeSchoolDepartment?: OptionItemFromServer;
  subjects: Array<
    OptionItemFromServer & {
      parent?: OptionItemFromServer;
    }
  >;
}
