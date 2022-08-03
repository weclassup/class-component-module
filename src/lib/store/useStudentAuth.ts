import { useCallback, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import { S3File } from "..";

import { studentClassAPI } from "../api/class.api";
import FileUploader from "../helper/file.uploader";
import history from "../history";
import keys from "../json/key.name.json";
import { OptionItemFromServer } from "../api";

export const useStudentAuth = createContainer(() => {
  const [authType] = useState<AuthType>("student");
  const [isSignIn, setIsSignIn] = useState<boolean | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );

  const userProfile = useMemo(() => {
    return studentProfile;
  }, [studentProfile]);

  const getUserProfile = useCallback(async () => {
    const { data } = await studentClassAPI.get<StudentProfile>(`/api/s/me`);
    setStudentProfile(data);
  }, []);

  const putToUpdateProfilePicture = useCallback(
    async (file: File) => {
      const id = await new FileUploader("student")
        .getResult(file)
        .then((res) => res?.id);

      const { data } = await studentClassAPI.put<StudentProfile>(
        `/api/s/me/profilePicture`,
        { profilePictureId: id }
      );
      setStudentProfile(data);
    },
    [userProfile]
  );

  const signOutHandler = useCallback(() => {
    setStudentProfile(null);
    setIsSignIn(false);
    window.localStorage.removeItem(keys.STUDENT_ACCESS_TOKEN);
    history.push("/");
  }, []);

  const manualUpdateProfile = useCallback(
    (profile: StudentProfile) => setStudentProfile(profile),
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

export default useStudentAuth;

export interface StudentProfile {
  email: string;
  phone?: string;

  /**
   * 個人照片編號
   * @format int32
   */
  profilePictureId?: number;

  /** 姓氏 */
  surName: string;

  /** 名字 */
  givenName: string;

  /** 暱稱 */
  nickName: string;

  /** 性別 */
  gender?: "MALE" | "FEMALE" | "OTHER";

  /**
   * 生日
   * @format date-time
   */
  birthday?: string;

  /** 家長代表 */
  parentName?: string;

  /**
   * 學習階段
   * @format int32
   */
  learnPhaseId?: number;

  /**
   * 年級
   * @format int32
   */
  learnPhaseGradeId?: number;

  /**
   * 學校縣市
   * @format int32
   */
  schoolCityId?: number;

  /**
   * 就讀學校
   * @format int32
   */
  schoolId?: number;

  /** 學校(自行輸入) */
  customSchoolName?: string;
  status: "ACTIVE" | "BLOCKED";
  learnPhase?: OptionItemFromServer;
  learnPhaseGrade?: OptionItemFromServer;
  schoolCity?: OptionItemFromServer;
  school?: OptionItemFromServer;
  promoteCode?: string;
  profilePicture?: S3File;
}
