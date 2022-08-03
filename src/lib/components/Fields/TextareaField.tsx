import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import classNames from "classnames";

type TextareaProps = JSX.IntrinsicElements["textarea"];
interface Props extends TextareaProps {
  register: UseFormRegisterReturn;
  error?: boolean;
}

export const TextareaField: React.FC<Props> = ({
  children,
  className,
  register,
  error,
  ...props
}) => {
  return (
    <textarea
      {...register}
      className={classNames(
        className,
        "resize-none",
        "w-full",
        "invalid:border-red",
        "h-24",
        "rounded-sm",
        "px-4",
        "py-3",
        "text-grey1",
        "placeholder-grey3",

        "border",
        "border-grey4",
        "focus:outline-none",
        "focus:border-primary",
        "read-only:border-grey4",
        "read-only:bg-grey6",
        "read-only:text-grey3",
        "read-only:focus:border-grey4",
        "read-only:cursor-not-allowed",
        "disabled:border-grey4",
        "disabled:bg-grey6",
        "disabled:text-grey3",
        "disabled:focus:border-grey4",
        "disabled:cursor-not-allowed",
        { "border-red": error }
      )}
      {...props}
    />
  );
};

export default TextareaField;
