import { studentClassAPI, StudentProfile } from "..";
import keys from "../json/key.name.json";

export interface StudentSignUpForm
  extends Omit<
    StudentProfile,
    | "profilePicture"
    | "profilePictureId"
    | "id"
    | "email"
    | "learnPhase"
    | "learnPhaseGrade"
    | "schoolCity"
    | "school"
    | "status"
  > {
  pwd: string;
  validationCode: string;
  validationToken: string;
}

export const postToIssueStudentSignUp = async (email: string) => {
  const {
    data: { validationToken },
  } = await studentClassAPI.post<{ validationToken: string }>(
    `/api/p/emailValidation/student`,
    { email }
  );

  return { validationToken };
};

export const postToVerifyCode = async (
  code: string,
  validationToken: string
) => {
  await studentClassAPI.post(`/api/p/emailValidation/verify`, {
    code,
    validationToken,
  });
};

export const postToSignInStudent = async (email: string, pwd: string) => {
  const {
    data: { token },
  } = await studentClassAPI.post<{ token: string }>(
    `/api/p/auth/student/signIn`,
    { email, pwd }
  );
  window.localStorage.setItem(keys.STUDENT_ACCESS_TOKEN, token);
};

export const postToSignUpStudent = async (formValues: StudentSignUpForm) => {
  const {
    data: { token },
  } = await studentClassAPI.post<{ token: string }>(
    `/api/p/auth/student/signUp`,
    formValues,
    { showErrorAlert: true }
  );
  window.localStorage.setItem(keys.STUDENT_ACCESS_TOKEN, token);
};

export const postToIssueForgotPassword = async (email: string) => {
  await studentClassAPI.post(`/api/p/auth/student/forgetPwd`, { email });
};

export const putToCommitPasswordReset = async (pwd: string, token: string) => {
  await studentClassAPI.put(`/api/p/auth/student/commitPwdReset`, {
    pwd,
    token,
  });
};

export const postToExchangeGoldRedeem = async (redeemCode: string) =>
  await studentClassAPI.post("/api/s/goldRedeem/exchange", { redeemCode });
