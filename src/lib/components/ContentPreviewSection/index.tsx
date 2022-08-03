import React, { useState } from "react";
import classNames from "classnames";
import {
  Div,
  Flexbox,
  Fonts,
  formatChecker,
  PreviewSwiper,
  S3File,
} from "../..";

interface Props {
  files?: S3File[];
  content?: string;
  section: "question" | "answer";
  containerClassName?: string;
}
export const ContentPreviewSection: React.FC<Props> = ({
  files,
  content,
  section,
  containerClassName,
}) => {
  const [label] = useState(section === "question" ? "題目" : "答案");

  return (
    <div className={classNames(containerClassName)}>
      <Div
        condition={
          formatChecker.isNotSet(files) || formatChecker.isEmptyArray(files)
        }
        className={classNames("px-6", "pt-4", "md:p-0")}
      >
        <Fonts
          fontSize={"primaryButton"}
          className={classNames(
            "px-2",
            "py-1",
            "w-fit",
            "rounded-xs",
            {
              "bg-dark-blue": section === "question",
              "bg-[#00B25D]": section === "answer",
            },
            "text-white"
          )}
        >
          {label}
        </Fonts>
      </Div>
      <PreviewSwiper
        label={label}
        labelClassName={classNames(
          {
            "bg-dark-blue": section === "question",
            "bg-[#00B25D]": section === "answer",
          },
          "text-white"
        )}
        files={files}
      />
      <Flexbox
        condition={formatChecker.isNotEmptyString(content)}
        className={classNames("py-5", "px-6")}
      >
        <p
          className={classNames(
            "text-sm",
            "text-grey1",
            "break-all",
            "whitespace-pre-line"
          )}
        >
          {content}
        </p>
      </Flexbox>
    </div>
  );
};
