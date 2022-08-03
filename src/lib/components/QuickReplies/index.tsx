import React, { useCallback, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import {
  Button,
  Flexbox,
  FontIconButton,
  Fonts,
  formatChecker,
  FormLabel,
  SecondaryModalContainer,
  TextField,
} from "../../";
import classNames from "classnames";
import { faTimesCircle } from "@fortawesome/pro-solid-svg-icons";
import { AxiosResponse } from "axios";
import { QuestionChatMessageDto } from "../../hooks/useChattingMessage";

const DEFAULT_QUICK_REPLIES: Record<
  QuestionChatMessageDto["issuer"],
  string[]
> = {
  STUDENT: ["再說明一下", "我瞭解了", "謝謝！"],
  TEACHER: [
    "請問這樣清楚嗎？",
    "還有哪邊不太懂的地方嗎？",
    "稍等我一下",
    "我再說明一次",
    "謝謝！",
  ],
};
const QUICK_REPLIES_CATEGORY = "QUICK_REPLIES";

export interface UserPreferenceDto {
  category: string;
  content?: string;
}
export interface SaveUserPreferenceReq {
  content?: string;
}
interface Props {
  quickReplyClickHandler: (reply: string) => void;
  getPreferenceUsingGet: (
    category: string
  ) => Promise<AxiosResponse<UserPreferenceDto>>;
  updatePreferenceUsingPut: (
    category: string,
    req: SaveUserPreferenceReq
  ) => Promise<AxiosResponse<UserPreferenceDto>>;
  whoAmI: QuestionChatMessageDto["issuer"];
}
export const QuickReplies: React.FC<Props> = ({
  quickReplyClickHandler,
  getPreferenceUsingGet,
  updatePreferenceUsingPut,
  whoAmI,
}) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [{ value }, callback] = useAsyncFn(async () => {
    return await getPreferenceUsingGet(QUICK_REPLIES_CATEGORY).then((res) => {
      const content = res.data.content;
      if (
        formatChecker.isNotSet(content) ||
        formatChecker.isEmptyString(content)
      )
        return [];

      return content.split(",");
    });
  }, []);

  useEffect(() => {
    callback();
  }, []);

  const saveNewRepliesHandler = useCallback(async (newReplies: string[]) => {
    const content = newReplies.join(",");
    await updatePreferenceUsingPut(QUICK_REPLIES_CATEGORY, {
      content,
    });
    await callback();
    setOpenEdit(false);
  }, []);

  if (formatChecker.isNotSet(value)) return null;

  return (
    <React.Fragment>
      <EditQuickReply
        saveHandler={saveNewRepliesHandler}
        open={openEdit}
        closeHandler={() => setOpenEdit(false)}
        currentReplies={value}
      />
      <Flexbox
        as={"ul"}
        className={classNames("py-3", "overflow-scroll", "px-6")}
      >
        {value.concat(DEFAULT_QUICK_REPLIES[whoAmI]).map((reply, idx) => (
          <Item
            onClick={() => quickReplyClickHandler(reply)}
            key={`${idx}_${reply}`}
            className={classNames("text-grey2", "border-grey2")}
          >
            {reply}
          </Item>
        ))}
        <Item
          className={classNames("text-white", "border-grey2", "bg-grey2")}
          onClick={() => setOpenEdit(true)}
        >
          編輯
        </Item>
      </Flexbox>
    </React.Fragment>
  );
};

const Item: React.FC<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ className, children, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        type={"button"}
        className={classNames(
          className,
          "px-[10px]",
          "py-[6px]",
          "text-sm",
          "border",
          "border-solid",
          "rounded-sm",
          "mr-2",
          "whitespace-nowrap"
        )}
      >
        {children}
      </button>
    </li>
  );
};

interface EditQuickReplyProps {
  open: boolean;
  closeHandler: () => void;
  currentReplies: string[];
  saveHandler: (newReplies: string[]) => void;
}
const EditQuickReply: React.FC<EditQuickReplyProps> = ({
  open,
  closeHandler,
  saveHandler,
  currentReplies,
}) => {
  const [repliesCache, setRepliesCache] = useState<string[]>([]);
  const [newReply, setNewReply] = useState<string>("");
  const repliesCount = repliesCache.length;
  const isLimitReached = repliesCount >= 10;

  useEffect(() => {
    if (open) {
      setRepliesCache(currentReplies);
    }
  }, [open]);

  const createHandler = () => {
    if (formatChecker.isEmptyString(newReply)) return;
    if (isLimitReached) return;
    setRepliesCache((prev) => [...prev, newReply]);
    setNewReply("");
  };

  const removeHandler = (index: number) => {
    setRepliesCache((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <SecondaryModalContainer
      open={open}
      closeHandler={closeHandler}
      disableConfirm={isLimitReached}
      confirmHandler={() => saveHandler(repliesCache)}
      cancelHandler={closeHandler}
      confirmText={"儲存"}
      cancelText={"取消"}
      renderHeader={() => (
        <React.Fragment>
          <span className={classNames("block")}>編輯常用詞</span>
          <Fonts as={"span"} className={classNames("text-grey2")}>
            已建立{" "}
            <span className={classNames("text-primary")}>{repliesCount}</span>{" "}
            個，還可以新增 {10 - repliesCount} 個
          </Fonts>
        </React.Fragment>
      )}
    >
      <div className={classNames("mb-4")}>
        <FormLabel>新增常用詞</FormLabel>
        <Flexbox>
          <TextField
            className={classNames("flex-[144]", "mr-4")}
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <Button
            buttonStyle={"primary"}
            type={"button"}
            className={classNames("flex-[64]")}
            onClick={createHandler}
            disabled={formatChecker.isEmptyString(newReply)}
          >
            新增
          </Button>
        </Flexbox>
      </div>
      <FormLabel>以建立常用詞</FormLabel>
      <ul>
        {repliesCache.map((reply, idx) => (
          <li
            key={`${reply}_${idx}`}
            className={classNames(
              "px-[10px]",
              "py-[6px]",
              "bg-grey5",
              "text-grey2",
              "w-fit",
              "rounded-sm",
              "mb-2"
            )}
          >
            {reply}
            <FontIconButton
              fontProps={{ icon: faTimesCircle }}
              defaultSize={false}
              className={classNames("w-[1.125rem]", "h-[1.125rem]", "ml-6")}
              onClick={() => removeHandler(idx)}
            />
          </li>
        ))}
      </ul>
    </SecondaryModalContainer>
  );
};
