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
      <FormHeading>????????????</FormHeading>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "mt-3", "lg:mt-4")}
      >
        ?????????????????????????????????????????????
        <br />
        ??????????????????????????????
      </Fonts>
      <div className={classNames("my-8", "lg:my-10")}>
        <FormLabel>??????????????????</FormLabel>
        <TextField
          error={isSet(errors["email"])}
          placeholder="??????????????????"
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
        ?????????
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
          ??????????????????
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
      <FormHeading>???????????????</FormHeading>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "mt-3", "lg:mt-4")}
      >
        ???????????????????????????
        <span className={classNames("text-primary")}>{watch("email")}</span>
        <br />
        ?????????????????????????????????????????????????????????
        ??????????????????????????????????????????????????????
      </Fonts>
      <Button
        disabled={counter !== 0}
        as="button"
        type="submit"
        buttonStyle="primary"
        fill
        className={classNames("my-8", "lg:my-10")}
      >
        {counter !== 0 ? `${counter}s ?????????????????????` : "????????????"}
      </Button>
      <Link
        to="/sign_in"
        className={classNames("block", "mx-auto", "text-center")}
      >
        <Fonts fontSize="secondaryBody" className={classNames("text-primary")}>
          ??????????????????
        </Fonts>
      </Link>
    </Form>
  );
};
