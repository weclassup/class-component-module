import React from "react";
import classNames from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";

import { isSet } from "../../../../../helper/format.checker";
import { passwordValidate, required } from "../../../../../helper/validator";
import { useQuery } from "../../../../../helper/location.helper";
import { putToCommitPasswordReset } from "../../../../../api/student";

import useIsOk, { IsOkModal } from "../../../../../hooks/useIsOk/useIsOk";
import Form from "../../../../Form/Form";
import FormLabel from "../../../../Form/FormLabel";
import TextField from "../../../../Fields/TextField";
import FormErrorMessage from "../../../../Form/FormErrorMessage";
import FormHeading from "../../../../Form/FormHeading";
import Fonts from "../../../../Fonts/Fonts";
import Button from "../../../../Button/Button";
import FormPageContainer from "../../../../Container/FormPageContainer";
import SuccessIcon from "../../../../../assets/cls-data-success-img.svg";

interface FormValues {
  pwd: string;
  confirmPwd: string;
}

const StudentResetPassword: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    handleSubmit,
    register,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm({ mode: "all" });
  const { resultHandler, isOk } = useIsOk();

  const query = useQuery();

  const onSubmit: SubmitHandler<FormValues> = async ({ pwd }) => {
    try {
      const token = query.get("t");
      if (isSet(token)) {
        await putToCommitPasswordReset(pwd, token);
        await resultHandler(true);
        history.push("/sign_in");
      } else {
        setError("pwd", { message: "請確認信箱連結。" });
      }
    } catch (error) {
      const message = error?.response?.data?.messages?.[0];
      setError("email", { message });
    }
  };

  return (
    <FormPageContainer>
      <IsOkModal
        isOk={isOk}
        success={{
          text: "重設成功",
          image: SuccessIcon,
        }}
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormHeading>重設密碼</FormHeading>
        <Fonts
          fontSize="secondaryBody"
          className={classNames("text-grey2", "mt-3", "lg:mt-4")}
        >
          密碼應包含英文與數字，介於 8 ~ 20 位數
        </Fonts>
        <div className={classNames("mt-8", "mb-4", "lg:mb-6")}>
          <FormLabel>密碼</FormLabel>
          <TextField
            autoComplete="new-password"
            error={isSet(errors["pwd"])}
            placeholder="密碼"
            type="password"
            register={register("pwd", {
              required,
              validate: passwordValidate,
            })}
          />
          <FormErrorMessage errors={errors} name="pwd" />
        </div>
        <div className={classNames("mb-8", "lg:mb-10")}>
          <FormLabel>確認密碼</FormLabel>
          <TextField
            autoComplete="new-password"
            error={isSet(errors["confirmPassword"])}
            placeholder="確認密碼"
            type="password"
            register={register("confirmPassword", {
              required,
              validate: (value) =>
                value === watch("pwd") ? undefined : "與密碼不一致",
            })}
          />
          <FormErrorMessage errors={errors} name="confirmPassword" />
        </div>
        <Button
          disabled={!isValid}
          as="button"
          type="submit"
          buttonStyle="primary"
          fill
        >
          下一步
        </Button>
      </Form>
    </FormPageContainer>
  );
};

export default StudentResetPassword;
