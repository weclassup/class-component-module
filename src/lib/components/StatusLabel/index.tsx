import React from "react";
import classNames from "classnames";
import { questionStatueEnum } from "../../static.options";

export type QuestionStatus =
  | "DRAFT"
  | "MATCHING"
  | "ANSWERING"
  | "ANSWERED"
  | "COMPLETE";
export const QuestionStatusLabel: React.FC<{
  status: QuestionStatus;
}> = ({ status }) => {
  return (
    <Label
      className={classNames(
        {
          "text-[#FF7A00]": status === "MATCHING",
          "text-grey2": status === "DRAFT",
          "text-[#7B61FF]": status === "ANSWERING",
          "text-[#00B25D]": status === "ANSWERED",
          "text-grey1": status === "COMPLETE",
        },
        {
          "bg-[#FF7A00]": status === "MATCHING",
          "bg-grey5": status === "DRAFT" || status === "COMPLETE",
          "bg-[#7B61FF]": status === "ANSWERING",
          "bg-[#00B25D]": status === "ANSWERED",
        },
        {
          "bg-opacity-[0.06]":
            status === "MATCHING" ||
            status === "ANSWERING" ||
            status === "ANSWERED",
        }
      )}
    >
      {questionStatueEnum[status]}
    </Label>
  );
};

type MatchType = "MATCH" | "SPECIFY";
export const MatchTypeLabel: React.FC<{
  type: MatchType;
}> = ({ type }) => {
  if (type === "MATCH") return null;

  return (
    <Label
      className={classNames(
        "text-dark-red",
        "bg-dark-red",
        "bg-opacity-[0.06]"
      )}
    >
      指定老師
    </Label>
  );
};

export const SubjectLabel: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <Label
      className={classNames(
        "text-[#1472A8]",
        "bg-[#1472A8]",
        "bg-opacity-[0.06]",
        className
      )}
    >
      {children}
    </Label>
  );
};

export const Label: React.FC<{ className?: string; condition?: boolean }> = ({
  children,
  className,
  condition = true,
}) => {
  if (!condition) return null;
  return (
    <li
      className={classNames(
        "px-2",
        "py-1",
        "rounded-xs",
        "mr-2",
        "last:mr-0",
        "whitespace-nowrap",
        "w-fit",
        className
      )}
    >
      <p className={classNames("text-sm", "font-medium")}>{children}</p>
    </li>
  );
};
