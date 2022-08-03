import { OptionItemFromServer } from "../api";
import { QuestionStatus } from "../components/StatusLabel";

interface StaticOptionItem<K extends string> {
  key: K;
  label: string;
  active?: boolean;
}

export const genderOptions: StaticOptionItem<Gender>[] = [
  { key: "MALE", label: "男" },
  { key: "FEMALE", label: "女" },
];

export const getOptionsFromServerOptions = (
  serverOptions?: OptionItemFromServer[]
): StaticOptionItem<any>[] =>
  serverOptions?.map(({ id, name }) => ({ key: id, label: name })) || [];

export const questionStatueEnum: Record<QuestionStatus, string> = {
  DRAFT: "草稿",
  MATCHING: "等待配對",
  ANSWERING: "等待回答",
  ANSWERED: "已回答",
  COMPLETE: "已完成",
};
