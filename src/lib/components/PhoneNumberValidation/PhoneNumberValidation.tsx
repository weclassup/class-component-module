import React, { useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";

import Modal from "../Modal/Modal";
import Fonts from "../Fonts/Fonts";
import FormLabel from "../Form/FormLabel";
import TextField from "../Fields/TextField";
import { codeValidate, required } from "../../helper/validator";
import { isSet } from "../../helper/format.checker";
import FormErrorMessage from "../Form/FormErrorMessage";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import useCounter from "../../hooks/useCounter/useCounter";

interface Props {
  show: boolean;
  phone: string;
  issuePhoneSignUpHandler: () => void;
  submitHandler: (code: string) => void;
  cancelHandler: (code: undefined) => void;
}

export const PhoneNumberValidation: React.FC<Props> = ({
  show,
  phone,
  issuePhoneSignUpHandler,
  submitHandler,
  cancelHandler,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitting },
  } = useForm<{ code: string }>({ mode: "all", shouldUnregister: true });
  const { counter, restart } = useCounter(30);
  const cachedPhone = useRef("");

  useEffect(() => {
    if (!show) return;
    if (phone === cachedPhone.current) return;
    issueHandler().then(() => {
      cachedPhone.current = phone;
    });
    // eslint-disable-next-line
  }, [show, phone]);

  const issueHandler = useCallback(async () => {
    try {
      await issuePhoneSignUpHandler();
      restart();
    } catch (e) {
      throw e;
    }
    // eslint-disable-next-line
  }, []);

  const codeSubmitHandler = useCallback<SubmitHandler<{ code: string }>>(
    async ({ code }) => {
      try {
        await submitHandler(code);
        cachedPhone.current = "";
      } catch (e) {
        throw e;
      }
    },
    [submitHandler]
  );

  return (
    <Modal visible={show}>
      <div
        className={classNames(
          "p-6",
          "bg-white",
          "rounded-xl",
          "w-[272px]",
          "lg:w-[560px]",
          "lg:py-12",
          "lg:px-20"
        )}
      >
        <Fonts
          fontSize="primaryHeading"
          className={classNames("text-grey1", "mb-4")}
        >
          驗證手機
        </Fonts>
        <Fonts fontSize="secondaryBody" className={classNames("text-grey2")}>
          驗證簡訊已寄送至{" "}
          <span className={classNames("text-primary")}>{phone}</span>
          <br />
          請查看手機簡訊並填入 6 位數驗證碼
        </Fonts>
        <div className={classNames("my-8", "lg:my-10")}>
          <Flexbox align="start" justify="between">
            <FormLabel>6 位數驗證碼</FormLabel>
            <Fonts
              as="button"
              type="button"
              onClick={issueHandler}
              disabled={counter > 0}
              fontSize="secondaryBody"
              className={classNames(
                "text-primary",
                "disabled:cursor-not-allowed",
                "disabled:text-grey2"
              )}
            >
              {counter !== 0 ? `${counter}s 後重新發送` : "重新發送"}
            </Fonts>
          </Flexbox>
          <TextField
            error={isSet(errors["code"])}
            placeholder="123456"
            register={register("code", {
              required,
              validate: codeValidate,
            })}
          />
          <FormErrorMessage errors={errors} name="code" />
        </div>
        <Flexbox>
          <Button
            as="button"
            type="button"
            buttonStyle="primary"
            className={classNames("mr-4", "lg:mr-6")}
            onClick={() => cancelHandler(undefined)}
          >
            取消
          </Button>
          <Button
            disabled={!isValid || isSubmitting}
            as="button"
            type="button"
            buttonStyle="primary"
            fill
            onClick={handleSubmit(codeSubmitHandler)}
          >
            送出
          </Button>
        </Flexbox>
      </div>
    </Modal>
  );
};

export default PhoneNumberValidation;
