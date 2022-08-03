import React, { useState } from "react";
import classNames from "classnames";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Link } from "react-router-dom";

import { isSet } from "../../../../../helper/format.checker";
import { emailValidate, required } from "../../../../../helper/validator";

import { postToIssueForgotPassword } from "../../../../../api/teacher";
import useCounter from "../../../../../hooks/useCounter/useCounter";

import FormPageContainer from "../../../../Container/FormPageContainer";
import Form from "../../../../Form/Form";
import FormLabel from "../../../../Form/FormLabel";
import TextField from "../../../../Fields/TextField";
import FormErrorMessage from "../../../../Form/FormErrorMessage";
import FormHeading from "../../../../Form/FormHeading";
import Fonts from "../../../../Fonts/Fonts";
import Button from "../../../../Button/Button";

interface ForgotPasswordFormValues {
  email: string;
}

const TeacherForgotPassword = () => {
  const method = useForm({ mode: "all" });

  return (
    <FormPageContainer>
      <FormProvider {...method}>
        <WizardForm />
      </FormProvider>
    </FormPageContainer>
  );
};

export default TeacherForgotPassword;

type Page = "email" | "confirm";

interface BasicWizardFormProps {
  goToPage: (page: Page) => void;
}

const WizardForm: React.FC = () => {
  const [page, setPage] = useState<Page>("email");

  if (page === "email") {
    return <EmailPage goToPage={setPage} />;
  } else if (page === "confirm") {
    return <ConfirmPage />;
  } else {
    return null;
  }
};

const EmailPage: React.FC<BasicWizardFormProps> = ({ goToPage }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useFormContext<ForgotPasswordFormValues>();

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async ({
    email,
  }) => {
    try {
      await postToIssueForgotPassword(email);
      goToPage("confirm");
    } catch (error) {
      const message = error?.response?.data?.messages?.[0];
      setError("email", { message });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeading>找回密碼</FormHeading>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "mt-3", "lg:mt-4")}
      >
        請輸入你在註冊時使用的電子郵件
        <br />
        我們將寄出重設密碼信
      </Fonts>
      <div className={classNames("my-8", "lg:my-10")}>
        <FormLabel>電子郵件帳號</FormLabel>
        <TextField
          error={isSet(errors["email"])}
          placeholder="電子郵件帳號"
          register={register("email", {
            required,
            validate: emailValidate,
          })}
        />
        <FormErrorMessage errors={errors} name="email" />
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
      <Link
        to="/sign_in"
        className={classNames(
          "block",
          "mx-auto",
          "text-center",
          "mt-8",
          "lg:mt-10"
        )}
      >
        <Fonts fontSize="secondaryBody" className={classNames("text-primary")}>
          返回登入頁面
        </Fonts>
      </Link>
    </Form>
  );
};

const ConfirmPage: React.FC = () => {
  const { handleSubmit, watch } = useFormContext<ForgotPasswordFormValues>();
  const { counter, restart } = useCounter(30);

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async ({
    email,
  }) => {
    await postToIssueForgotPassword(email);
    restart();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeading>確認收件匣</FormHeading>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "mt-3", "lg:mt-4")}
      >
        重設密碼信已寄送至
        <span className={classNames("text-primary")}>{watch("email")}</span>
        <br />
        請前往收件匣查看，依照信中指示重設密碼
        若未收到，請重新發送並留意垃圾信件匣
      </Fonts>
      <Button
        disabled={counter !== 0}
        as="button"
        type="submit"
        buttonStyle="primary"
        fill
        className={classNames("my-8", "lg:my-10")}
      >
        {counter !== 0 ? `${counter}s 後可以重新發送` : "重新發送"}
      </Button>
      <Link
        to="/sign_in"
        className={classNames("block", "mx-auto", "text-center")}
      >
        <Fonts fontSize="secondaryBody" className={classNames("text-primary")}>
          返回登入頁面
        </Fonts>
      </Link>
    </Form>
  );
};
