import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Button from "../Button/Button";

import Flexbox from "../Flexbox/Flexbox";

type InputProps = JSX.IntrinsicElements["input"];

interface Props extends InputProps {
  register: UseFormRegisterReturn;
  error?: boolean;
  isConfirm?: boolean;
  verifySMSHandler: () => void;
  onPhoneChangeClick: () => void;
  isPhoneNumberInvalid: boolean;
}

export const PhoneField: React.FC<Props> = ({
  register,
  error,
  className,
  isConfirm,
  onPhoneChangeClick,
  verifySMSHandler,
  isPhoneNumberInvalid,
  ...props
}) => {
  const clickHandler = () => {
    if (isConfirm) {
      onPhoneChangeClick();
    } else {
      verifySMSHandler();
    }
  };

  return (
    <Flexbox align="stretch">
      <Flexbox align="center" expand className={classNames("relative")}>
        <input
          readOnly={isConfirm}
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
            { "border-red": error }
          )}
          {...props}
        />
        <Flexbox
          condition={isConfirm}
          justify="center"
          align="center"
          className={classNames(
            "w-10",
            "h-10",
            "text-green",
            "text-lg",
            "absolute",
            "right-1"
          )}
        >
          <FontAwesomeIcon icon={faCheckCircle} />
        </Flexbox>
      </Flexbox>
      <Button
        buttonStyle="primary"
        as="button"
        type="button"
        onClick={clickHandler}
        defaultSize={false}
        className={classNames("w-[96px]", "ml-4", "flex-shrink-0")}
        disabled={isPhoneNumberInvalid}
      >
        {isConfirm ? "變更手機" : "進行驗證"}
      </Button>
    </Flexbox>
  );
};

export default PhoneField;
