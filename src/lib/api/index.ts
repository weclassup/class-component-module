import { classAPI } from "./class.api";

export interface SearchOptionOptionsPayload {
  keyword?: string;
  optionKey: OptionKeyType;
  parentIds: number[];
}

type OptionKeyType =
  | "SUBJECT"
  | "SUBJECT_CATEGORY"
  | "LEARN_PHASE"
  | "LEARN_PHASE_GRADE"
  | "DEGREE"
  | "SCHOOL"
  | "SCHOOL_DEPARTMENT"
  | "CITY";

export interface OptionItemFromServer {
  id: number;
  name: string;
}

interface SearchOptionWithChildrenOptionsPayload {
  optionKey: OptionKeyType;
  childOptionKey: OptionKeyType;
}

interface OptionWithChildrenItemFromServer extends OptionItemFromServer {
  children: OptionItemFromServer[];
}

// GET
export const getToCheckingPromoteCode = async (promoteCode: string) =>
  await classAPI.get<{ valid: boolean }>("/api/p/promoteCode/check", {
    params: { promoteCode },
  });

// POST
export const postToSearchOptions = async (
  searchOption: SearchOptionOptionsPayload
) =>
  await classAPI
    .post<OptionItemFromServer[]>(`/api/p/options/search`, searchOption)
    .then((res) => res.data);

export const postToSearchOptionsWithChildren = async (
  searchOption: SearchOptionWithChildrenOptionsPayload
) =>
  await classAPI
    .post<OptionWithChildrenItemFromServer[]>(
      `/api/p/options/search/withChildren`,
      searchOption
    )
    .then((res) => res.data);

export type SysConfigId =
  | "TEACHER_ANSWER_EXPIRATION"
  | "MATCH_EXPIRATION"
  | "SPECIFY_TEACHER_EXPIRATION_OPTION_1"
  | "SPECIFY_TEACHER_EXPIRATION_OPTION_2"
  | "STUDENT_COMPLETE_QUESTION_EXPIRATION"
  | "TEACHER_QUIZ_LINK"
  | "TEACHER_GOLD_EXCHANGE_RATE_GOLD"
  | "TEACHER_GOLD_EXCHANGE_RATE_NT"
  | "TEACHER_GOLD_WITHDRAW_MIN"
  | "TEACHER_PROMOTE_REWARD"
  | "STUDENT_PROMOTE_REWARD";
export type SysConfigValueType = "MINUTE" | "HOUR" | "LINK";
export type SysConfig = {
  configValue: string;
  configValueType: SysConfigValueType;
  id: SysConfigId;
};
export const postToGetSysConfigs = async (ids: SysConfigId[]) =>
  await classAPI
    .post<SysConfig[]>("/api/p/configs/search", { ids })
    .then((res) => res.data);
