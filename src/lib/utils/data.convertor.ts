import { TeacherProfile } from "../store/useTeacherAuth";
import {
  TeacherProfileUpdatePayload,
  TeacherSignUpFormValues,
  TeacherSignUpPayload,
} from "../api/teacher";
import { classMoment, FileUploader, formatChecker } from "../";
import { QuestionDto } from "../hooks/useGetQuestionExpiration";
import { getCleanMoment, getUTCFormat } from "../helper/moment.helper";

export const getTeacherSignUpFormDefaultValues = (
  teacherProfile: TeacherProfile
): Partial<TeacherSignUpFormValues> => {
  const {
    profilePicture,
    surName,
    givenName,
    nickName,
    gender,
    birthday,
    mainVerificationImage,
    phone,
    degreeId,
    degreeSchoolCityId,
    degreeSchoolId,
    degreeSchoolDepartmentId,
    specializeSubjectIds,
    selfIntroduction,
    degreeImage,
    studentCardOrTranscriptImage,
    teacherLicenseImage,
    otherProveFiles,
  } = teacherProfile.pendingProfile!;

  const birthdayMoment = classMoment(birthday);

  return {
    profilePicture,
    surName,
    givenName,
    nickName,
    gender,
    birthYear: String(birthdayMoment.year()),
    birthMonth: String(birthdayMoment.month() + 1),
    birthDate: String(birthdayMoment.date()),
    mainVerificationImage,
    phone,
    degreeId,
    degreeSchoolCityId,
    degreeSchoolId,
    degreeSchoolDepartmentId,
    specializeSubjectIds,
    selfIntroduction,
    degreeImage,
    studentCardOrTranscriptImage,
    teacherLicenseImage,
    otherProveFiles,
    isPhoneConfirmed: true,
  };
};

export const getTeacherSignUpPayload = async ({
  degreeImage = undefined,
  studentCardOrTranscriptImage = undefined,
  teacherLicenseImage = undefined,
  otherProveFiles = [],
  emailValidationCode,
  emailValidationToken,
  phoneValidationCode,
  phoneValidationToken,
  ...restFormValues
}: TeacherSignUpFormValues): Promise<TeacherSignUpPayload> => {
  const issueBeforeSignUpConfig = {
    emailValidationCode,
    emailValidationToken,
    phoneValidationCode,
    phoneValidationToken,
  };

  const [degreeImageId, studentCardOrTranscriptImageId, teacherLicenseImageId] =
    await new FileUploader("teacher", issueBeforeSignUpConfig)
      .getResult([
        degreeImage,
        studentCardOrTranscriptImage,
        teacherLicenseImage,
      ])
      .then((result) => result.map((file) => file?.id));

  const otherProveFileIds = await new FileUploader(
    "teacher",
    issueBeforeSignUpConfig
  )
    .getResult(otherProveFiles)
    .then((result) => result.map((file) => file?.id));

  const birthdayMoment = classMoment().set({
    year: Number(restFormValues.birthYear),
    month: Number(restFormValues.birthMonth) - 1,
    date: Number(restFormValues.birthDate),
  });
  const birthday = getUTCFormat(getCleanMoment(birthdayMoment));

  return {
    birthday,
    degreeId: restFormValues.degreeId,
    degreeImageId,
    degreeSchoolDepartmentId: restFormValues.degreeSchoolDepartmentId || 0,
    degreeSchoolId: restFormValues.degreeSchoolId,
    degreeSchoolCityId: restFormValues.degreeSchoolCityId,
    emailValidationCode,
    emailValidationToken,
    gender: restFormValues.gender,
    givenName: restFormValues.givenName,
    mainVerificationImageId: restFormValues.mainVerificationImageId,
    nickName: restFormValues.nickName,
    otherProveFileIds,
    phoneValidationCode,
    phoneValidationToken,
    profilePictureId: restFormValues.profilePictureId,
    pwd: restFormValues.pwd,
    selfIntroduction: restFormValues.selfIntroduction,
    specializeSubjectIds: restFormValues.specializeSubjectIds,
    studentCardOrTranscriptImageId,
    surName: restFormValues.surName,
    teacherLicenseImageId,
    customSchoolDepartmentName: restFormValues.customSchoolDepartmentName,
    customSchoolName: restFormValues.customSchoolName,
    currentJobLocation: restFormValues.currentJobLocation,
    promoteCode: restFormValues.promoteCode,
  };
};

export const getTeacherUpdateProfilePayload = async ({
  degreeImage = undefined,
  studentCardOrTranscriptImage = undefined,
  teacherLicenseImage = undefined,
  otherProveFiles = [],
  emailValidationCode,
  emailValidationToken,
  phoneValidationCode,
  phoneValidationToken,
  ...restFormValues
}: TeacherSignUpFormValues): Promise<TeacherProfileUpdatePayload> => {
  const issueBeforeSignUpConfig = {
    emailValidationCode,
    emailValidationToken,
    phoneValidationCode,
    phoneValidationToken,
  };

  const [degreeImageId, studentCardOrTranscriptImageId, teacherLicenseImageId] =
    await new FileUploader("teacher", issueBeforeSignUpConfig)
      .getResult([
        degreeImage,
        studentCardOrTranscriptImage,
        teacherLicenseImage,
      ])
      .then((result) => result.map((file) => file?.id));

  const otherProveFileIds = await new FileUploader(
    "teacher",
    issueBeforeSignUpConfig
  )
    .getResult(otherProveFiles)
    .then((result) => result.map((file) => file?.id));

  const birthdayMoment = classMoment().set({
    year: Number(restFormValues.birthYear),
    month: Number(restFormValues.birthMonth) - 1,
    date: Number(restFormValues.birthDate),
  });
  const birthday = getUTCFormat(getCleanMoment(birthdayMoment));

  return {
    birthday,
    degreeId: restFormValues.degreeId,
    degreeImageId,
    degreeSchoolDepartmentId: restFormValues.degreeSchoolDepartmentId || 0,
    degreeSchoolId: restFormValues.degreeSchoolId,
    degreeSchoolCityId: restFormValues.degreeSchoolCityId,
    gender: restFormValues.gender,
    givenName: restFormValues.givenName,
    mainVerificationImageId: undefined,
    nickName: restFormValues.nickName,
    otherProveFileIds,
    profilePictureId: restFormValues.profilePictureId,
    selfIntroduction: restFormValues.selfIntroduction,
    specializeSubjectIds: restFormValues.specializeSubjectIds,
    studentCardOrTranscriptImageId,
    surName: restFormValues.surName,
    teacherLicenseImageId,
    customSchoolDepartmentName: restFormValues.customSchoolDepartmentName,
    customSchoolName: restFormValues.customSchoolName,
    currentJobLocation: restFormValues.currentJobLocation,
    promoteCode: restFormValues.promoteCode,
  };
};

export const getRestTime = (expireAt: string): string => {
  // const nowMoment = classMoment();
  // const expireAtMoment = classMoment(expireAt);
  // const restSecond = expireAtMoment.diff(nowMoment, "seconds") % 60;
  // const restMinute = expireAtMoment.diff(nowMoment, "minute") % 60;
  // const restHour = expireAtMoment.diff(nowMoment, "hours");
  //
  // return `剩餘 ${stringHandler.leadingZero(
  //   restHour
  // )}時${stringHandler.leadingZero(restMinute)}分${stringHandler.leadingZero(
  //   restSecond
  // )}秒 `;
  const expireAtMoment = classMoment(expireAt);
  return `到期: ${expireAtMoment.format("YYYY/MM/DD HH:mm")}`;
};

export const getQuestionExpireAtUTCFormat = ({
  status,
  teacherMatchType,
  specifyTeacherExpireAt,
  matchExpireAt,
  teacherAnswerExpireAt,
  studentCompleteExpireAt,
}: QuestionDto) => {
  let expireAt = "";
  if (status === "MATCHING") {
    if (teacherMatchType === "SPECIFY") {
      expireAt = specifyTeacherExpireAt || "";
    } else {
      expireAt = matchExpireAt || "";
    }
  } else if (status === "ANSWERING") {
    expireAt = teacherAnswerExpireAt || "";
  } else if (status === "ANSWERED") {
    expireAt = studentCompleteExpireAt || "";
  }

  return expireAt;
};

export const getQuestionRestTime = ({
  status,
  teacherMatchType,
  specifyTeacherExpireAt,
  matchExpireAt,
  teacherAnswerExpireAt,
  studentCompleteExpireAt,
}: QuestionDto) => {
  let expireAt = getQuestionExpireAtUTCFormat({
    status,
    teacherMatchType,
    specifyTeacherExpireAt,
    matchExpireAt,
    teacherAnswerExpireAt,
    studentCompleteExpireAt,
  });

  if (formatChecker.isEmptyString(expireAt)) return null;

  return getRestTime(expireAt);
};
