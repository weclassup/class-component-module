import { useMemo } from "react";
import { formatChecker, getQuestionRestTime } from "../../";

export interface QuestionDto {
  status: "DRAFT" | "MATCHING" | "ANSWERING" | "ANSWERED" | "COMPLETE";

  matchExpireAt?: string;
  specifyTeacherExpireAt?: string;
  studentCompleteExpireAt?: string;
  teacherAnswerExpireAt?: string;

  teacherId?: number;
  teacherMatchType: "MATCH" | "SPECIFY";
}

export const useGetQuestionExpiration = (content?: QuestionDto) => {
  return useMemo(
    () =>
      formatChecker.isSet(content)
        ? getQuestionRestTime({
            status: content?.status,
            teacherMatchType: content?.teacherMatchType,
            specifyTeacherExpireAt: content?.specifyTeacherExpireAt,
            matchExpireAt: content?.matchExpireAt,
            teacherAnswerExpireAt: content?.teacherAnswerExpireAt,
            studentCompleteExpireAt: content?.studentCompleteExpireAt,
          })
        : null,
    [
      content?.status,
      content?.teacherMatchType,
      content?.specifyTeacherExpireAt,
      content?.matchExpireAt,
      content?.teacherAnswerExpireAt,
      content?.studentCompleteExpireAt,
    ]
  );
};
