import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  classMoment,
  Div,
  fileHelper,
  Flexbox,
  FontIcon,
  FontIconButton,
  Fonts,
  formatChecker,
  QuickReplies,
} from "../../";

import {
  faCloudUpload,
  faFileAlt,
  faFileImage,
  faMicrophone,
  faPaperPlane,
  faVideo,
} from "@fortawesome/pro-solid-svg-icons";
import { QuestionChatMessageDto } from "../../hooks/useChattingMessage";
import { AxiosResponse } from "axios";
import { SaveUserPreferenceReq, UserPreferenceDto } from "../QuickReplies";
import { QuestionStatus } from "../StatusLabel";

interface Props {
  questionId: number;
  newMessages: QuestionChatMessageDto[];
  oldMessages: PageDto<QuestionChatMessageDto>;
  fileChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
  sendContentHandler: (content: string) => Promise<void>;
  getPreferenceUsingGet: (
    category: string
  ) => Promise<AxiosResponse<UserPreferenceDto>>;
  updatePreferenceUsingPut: (
    category: string,
    req: SaveUserPreferenceReq
  ) => Promise<AxiosResponse<UserPreferenceDto>>;
  renderWaring: React.ComponentType;
  sender: QuestionChatMessageDto["issuer"];
  chattingRef: React.MutableRefObject<HTMLUListElement | null>;
  status: QuestionStatus;
}
export const ChattingRoom: React.FC<Props> = ({
  questionId,
  oldMessages,
  newMessages,
  fileChangeHandler,
  sendContentHandler,
  updatePreferenceUsingPut,
  getPreferenceUsingGet,
  sender,
  chattingRef,
  status,
  ...props
}) => {
  const [content, setContent] = useState<string>("");
  const [isOnComposing, setIsOnComposing] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (formatChecker.isNotSet(chattingRef.current)) return;
    if (oldMessages.atPage === 1) {
      const endPosition = chattingRef.current.scrollHeight;
      chattingRef.current?.scrollTo?.(0, endPosition);
    }
  }, [oldMessages]);

  useEffect(() => {
    if (formatChecker.isNotSet(chattingRef.current)) return;
    const endPosition = chattingRef.current.scrollHeight;
    chattingRef.current?.scrollTo?.(0, endPosition);
  }, [newMessages]);

  const contentChangeHandler = useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >((e) => {
    setContent(e.target.value);
  }, []);

  const quickReplyClickHandler = useCallback((reply: string) => {
    setContent((prev) => `${prev}${reply}`);
  }, []);

  const onSendClick = useCallback(async () => {
    await sendContentHandler(content);
    setContent("");
  }, [content]);

  const onKeyDown = useCallback<React.KeyboardEventHandler>(
    async (event) => {
      if (buttonRef.current?.disabled) return;
      if (isOnComposing) return;
      if (event.key.toLocaleLowerCase() === "enter") {
        await onSendClick();
      }
    },
    [onSendClick, isOnComposing]
  );

  if (formatChecker.isNotSet(oldMessages)) return null;

  return (
    <div className={classNames("w-full", "h-full", "flex", "flex-col")}>
      <Div
        condition={
          formatChecker.isEmptyArray(oldMessages.items) &&
          formatChecker.isEmptyArray(newMessages) &&
          status !== "COMPLETE"
        }
        className={classNames("py-3", "bg-grey5")}
      >
        <props.renderWaring />
      </Div>
      <Flexbox
        direction={"col"}
        className={classNames("flex-1", "max-h-full", "bg-white")}
      >
        <ul
          className={classNames("flex-1", "px-6", "py-3", "overflow-scroll")}
          ref={chattingRef}
        >
          {oldMessages.items.map((message) => (
            <Message key={message.id} {...message} sender={sender} />
          ))}
          {newMessages.map((message) => (
            <Message key={message.id} {...message} sender={sender} />
          ))}
        </ul>
        <Div
          condition={status !== "COMPLETE"}
          className={classNames("h-[3.625rem]", "flex-shrink-0")}
        >
          <QuickReplies
            quickReplyClickHandler={quickReplyClickHandler}
            updatePreferenceUsingPut={updatePreferenceUsingPut}
            getPreferenceUsingGet={getPreferenceUsingGet}
            whoAmI={sender}
          />
        </Div>
        <Div
          condition={status !== "COMPLETE"}
          className={classNames("border-t", "border-solid", "border-grey4")}
        >
          <div className={classNames("pt-3", "px-6")}>
            <textarea
              value={content}
              onChange={contentChangeHandler}
              onKeyDown={onKeyDown}
              onCompositionStart={() => setIsOnComposing(true)}
              onCompositionEnd={() => setIsOnComposing(false)}
              placeholder={"請輸入訊息"}
              className={classNames(
                "text-grey1",
                "placeholder-grey3",
                "resize-none",
                "h-12",
                "focus:outline-none",
                "w-full"
              )}
            />
          </div>
          <Flexbox justify={"between"} className={classNames("px-4", "pb-2")}>
            <label htmlFor={"fileUpload"}>
              <FontIcon
                defaultSize={false}
                fontProps={{ icon: faCloudUpload }}
                className={classNames(
                  "text-[1.25rem]",
                  "text-primary",
                  "w-10",
                  "h-10",
                  "hover-hover:hover:cursor-pointer"
                )}
              />
              <input
                id={"fileUpload"}
                type={"file"}
                className={classNames("hidden")}
                onChange={fileChangeHandler}
              />
            </label>
            <FontIconButton
              ref={buttonRef}
              disabled={formatChecker.isEmptyString(content)}
              onClick={onSendClick}
              fontProps={{ icon: faPaperPlane }}
              className={classNames(
                "text-[1.25rem]",
                "text-primary",
                "disabled:text-grey3"
              )}
            />
          </Flexbox>
        </Div>
      </Flexbox>
    </div>
  );
};

interface MessageContainerProps extends Pick<QuestionChatMessageDto, "issuer"> {
  sender: QuestionChatMessageDto["issuer"];
}
const MessageContainer: React.FC<MessageContainerProps> = ({
  issuer,
  children,
  sender,
}) => {
  return (
    <Flexbox
      as={"li"}
      align={"end"}
      justify={"end"}
      className={classNames({ "flex-row-reverse": issuer !== sender }, "mb-2")}
    >
      {children}
    </Flexbox>
  );
};

interface MessageProps extends QuestionChatMessageDto {
  sender: QuestionChatMessageDto["issuer"];
}
const Message: React.FC<MessageProps> = ({
  content,
  issuer,
  createdAt,
  files,
  sender,
}) => {
  const createAtFormat = useRef<string>(classMoment(createdAt).format("hh:mm"));

  return (
    <MessageContainer issuer={issuer} sender={sender}>
      <p className={classNames("text-grey2", "text-[0.75rem]", "mx-2")}>
        {createAtFormat.current}
      </p>
      <StringMessage content={content} issuer={issuer} sender={sender} />
      <FileMessage files={files} issuer={issuer} />
    </MessageContainer>
  );
};

interface StringMessageProps
  extends Pick<QuestionChatMessageDto, "content" | "issuer"> {
  sender: QuestionChatMessageDto["issuer"];
}
const StringMessage: React.FC<StringMessageProps> = ({
  content,
  issuer,
  sender,
}) => {
  if (formatChecker.isEmptyString(content)) return null;
  return (
    <Fonts
      fontSize={"primaryBody"}
      className={classNames(
        {
          "bg-primary": issuer === sender,
          "text-white": issuer === sender,
          "bg-grey4": issuer !== sender,
        },
        "px-3",
        "py-2",
        "rounded-xl"
      )}
    >
      {content}
    </Fonts>
  );
};

const FileMessage: React.FC<Pick<QuestionChatMessageDto, "files" | "issuer">> =
  ({ files }) => {
    if (formatChecker.isEmptyArray(files)) return null;
    const file = files[0];
    const fileType = fileHelper.getFileType(file.contentType);

    const icon = () => {
      switch (fileType) {
        case "image":
          return faFileImage;
        case "video":
          return faVideo;
        case "audio":
          return faMicrophone;
        case "else":
          return faFileAlt;
      }
    };

    return (
      <a
        href={file.url}
        download
        rel={"noopener noreferrer"}
        target={"_blank"}
        className={classNames(
          "bg-grey4",
          "px-3",
          "py-2",
          "rounded-xl",
          "flex",
          "items-center"
        )}
      >
        <FontIcon
          fontProps={{ icon: icon() }}
          defaultSize={false}
          className={classNames(
            "w-8",
            "h-8",
            "bg-white",
            "rounded-cl",
            "flex-shrink-0",
            "mr-2.5"
          )}
        />
        <Flexbox as={"span"} direction={"col"} align={"start"}>
          <Fonts
            as={"span"}
            fontSize={"primaryButton"}
            className={classNames("line-clamp-2", "text-left")}
          >
            {file.name}
          </Fonts>
          <p className={classNames("text-[0.75rem]")}>
            {fileHelper.getFileSize(file.size || 0)}
          </p>
        </Flexbox>
      </a>
    );
  };
