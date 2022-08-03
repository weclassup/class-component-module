import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import classNames from "classnames";

type InputProps = JSX.IntrinsicElements["input"];
interface Props extends InputProps {
  register?: UseFormRegisterReturn;
  error?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  condition?: boolean;
}
interface PropsWithRegister {
  register: UseFormRegisterReturn;
  error?: boolean;
}
interface PropsWithoutRegister {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const TextField: React.FC<
  Props & (PropsWithRegister | PropsWithoutRegister)
> = ({
  children,
  className,
  register = {},
  error,
  condition = true,
  ...props
}) => {
  if (!condition) return null;
  return (
    <input
      {...register}
      className={classNames(
        className,
        "w-full",
        "invalid:border-red",
        "h-12",
        "rounded-sm",
        "px-4",
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

export default TextField;
