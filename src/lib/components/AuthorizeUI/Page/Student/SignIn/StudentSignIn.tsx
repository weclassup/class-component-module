import React from "react";
import classNames from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, RouteComponentProps } from "react-router-dom";

import { isSet } from "../../../../../helper/format.checker";
import { getHref } from "../../../../../helper/location.helper";
import {
  emailValidate,
  passwordValidate,
  required,
} from "../../../../../helper/validator";

import useStudentAuth from "../../../../../store/useStudentAuth";
import { postToSignInStudent } from "../../../../../api/student";

import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from "../../../../Form/Form";
import FormLabel from "../../../../Form/FormLabel";
import TextField from "../../../../Fields/TextField";
import FormErrorMessage from "../../../../Form/FormErrorMessage";
import FormHeading from "../../../../Form/FormHeading";
import Flexbox from "../../../../Flexbox/Flexbox";
import Fonts from "../../../../Fonts/Fonts";
import Button from "../../../../Button/Button";
import FormPageContainer from "../../../../Container/FormPageContainer";
import { getErrorMessageFromResponse } from "../../../../../helper/error.message";

interface SignInFormValues {
  email: string;
  pwd: string;
}

const StudentSignIn: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    formState: { errors, isValid },
    register,
    handleSubmit,
    setError,
  } = useForm<SignInFormValues>({ mode: "all" });
  const { getUserProfile, setIsSignIn } = useStudentAuth.useContainer();

  const onSubmit: SubmitHandler<SignInFormValues> = async ({ email, pwd }) => {
    try {
      await postToSignInStudent(email, pwd);
      await getUserProfile();
      setIsSignIn(true);
      history.push("/");
    } catch (e) {
      const message = getErrorMessageFromResponse(e);
      setError("pwd", { message });
    }
  };

  return (
    <FormPageContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Flexbox align="baseline" justify="between">
          <FormHeading>學生登入</FormHeading>
          <Fonts
            as="a"
            href={`${getHref("teacher")}/sign_in`}
            fontSize="secondaryBody"
            className={classNames("text-primary")}
          >
            老師登入
            <FontAwesomeIcon
              className={classNames("ml-2")}
              icon={faChevronRight}
            />
          </Fonts>
        </Flexbox>
        <div className={classNames("mt-8", "lg:mt-10")}>
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
        <div className={classNames("mt-4", "lg:mt-6")}>
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
        <Button
          disabled={!isValid}
          as="button"
          type="submit"
          buttonStyle="primary"
          fill
          className={classNames("my-8", "lg:my-10")}
        >
          登入
        </Button>
        <Link
          to="/forgot_password"
          className={classNames(
            "block",
            "mx-auto",
            "text-center",
            "mb-4",
            "lg:mb-6"
          )}
        >
          <Fonts
            fontSize="secondaryBody"
            className={classNames("text-primary")}
          >
            忘記密碼
          </Fonts>
        </Link>
        <Fonts
          fontSize="secondaryBody"
          className={classNames("block", "mx-auto", "flex", "justify-center")}
        >
          <span className={classNames("text-grey2")}>還沒有帳號嗎？</span>
          <Link to="/register" className={classNames("text-primary")}>
            註冊
          </Link>
        </Fonts>
      </Form>
    </FormPageContainer>
  );
};

export default StudentSignIn;
