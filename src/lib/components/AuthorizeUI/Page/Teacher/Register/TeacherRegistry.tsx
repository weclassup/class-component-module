import React, { useEffect, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useAsync } from "react-use";

import {
  birthDateValidate,
  birthMonthValidate,
  birthYearValidate,
  codeValidate,
  emailValidate,
  passwordValidate,
  phoneValidate,
  required,
  requiredOption,
} from "../../../../../helper/validator";
import {
  isNotEmptyString,
  isNotSet,
  isSet,
  isTrue,
} from "../../../../../helper/format.checker";
import FileUploader from "../../../../../helper/file.uploader";

import {
  postToIssueTeacherSignUp,
  postToSignUpTeacher,
  postToVerifyCode,
  putToCommitTeacherProfile,
  putToUpdateTeacherPendingProfile,
  TeacherSignUpFormValues,
} from "../../../../../api/teacher";
import {
  getTeacherSignUpFormDefaultValues,
  getTeacherSignUpPayload,
  getTeacherUpdateProfilePayload,
} from "../../../../../utils/data.convertor";
import useAsyncPrompt from "../../../../../hooks/useAsyncPrompt/useAsyncPrompt";
import useIsOk, { IsOkModal } from "../../../../../hooks/useIsOk/useIsOk";
import useCounter from "../../../../../hooks/useCounter/useCounter";
import useTeacherAuth from "../../../../../store/useTeacherAuth";

import keys from "../../../../../json/key.name.json";

import { getErrorMessageFromResponse } from "../../../../../helper/error.message";
import {
  getToCheckingPromoteCode,
  postToGetSysConfigs,
  postToSearchOptions,
} from "../../../../../api";
import {
  genderOptions,
  getOptionsFromServerOptions,
} from "../../../../../static.options";

import Form from "../../../../Form/Form";
import FormHeading from "../../../../Form/FormHeading";
import FormLabel from "../../../../Form/FormLabel";
import FormErrorMessage from "../../../../Form/FormErrorMessage";
import TextField from "../../../../Fields/TextField";
import TextareaField from "../../../../Fields/TextareaField";
import Dropdown from "../../../../Dropdown/Dropdown";
import PhoneField from "../../../../Fields/PhoneField";
import PersonalPhotoField from "../../../../Fields/PersonalPhotoField";
import DocumentField from "../../../../Fields/DocumentField";
import SubjectSelection from "../../../../Fields/SubjectSelection";
import PhoneNumberValidation from "../../../../PhoneNumberValidation/PhoneNumberValidation";
import PictureSample from "./PictureSample";
import IntroductionSample from "./IntroductionSample";

import {
  faExclamationTriangle,
  faTimes,
  faUserCheck,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SuccessIcon from "../../../../../assets/cls-phone-success-img.svg";
import FailureIcon from "../../../../../assets/cls-phone-fail-img.svg";
import FormPageContainer from "../../../../Container/FormPageContainer";
import Button from "../../../../Button/Button";
import Fonts from "../../../../Fonts/Fonts";
import Flexbox from "../../../../Flexbox/Flexbox";
import BirthdayField from "../../../../Fields/BirthdayField";
import Div from "../../../../Element/Div";

const TeacherRegistry = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { userProfile } = useTeacherAuth.useContainer();
  const method = useForm<TeacherSignUpFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if (isNotSet(userProfile)) return;
    const defaultValues = getTeacherSignUpFormDefaultValues(userProfile);
    method.reset(defaultValues);
    // eslint-disable-next-line
  }, [userProfile]);

  return (
    <FormPageContainer customRef={ref}>
      <FormProvider {...method}>
        <WizardForm parentRef={ref.current} />
      </FormProvider>
    </FormPageContainer>
  );
};

export default TeacherRegistry;

type Page =
  | "email"
  | "code"
  | "password"
  | "info"
  | "degree"
  | "document"
  | "processing"
  | "reject";

interface BasicWizardFormProps {
  goToPage: (page: Page) => void;
}

const WizardForm: React.FC<{ parentRef: HTMLDivElement | null }> = ({
  parentRef,
}) => {
  const [page, setPage] = useState<Page>("email");
  // const [page, setPage] = useState<Page>("degree");
  const { userProfile } = useTeacherAuth.useContainer();

  useEffect(() => {
    if (!parentRef) return;
    parentRef.scrollIntoView();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (userProfile?.profileStatus === "PROCESSING") {
      setPage("processing");
    } else if (userProfile?.profileStatus === "REJECTED") {
      setPage("reject");
    }
  }, [userProfile?.profileStatus]);

  if (page === "email") {
    return <EmailPage goToPage={setPage} />;
  } else if (page === "code") {
    return <CodePage goToPage={setPage} />;
  } else if (page === "password") {
    return <PasswordPage goToPage={setPage} />;
  } else if (page === "info") {
    return <InfoPage goToPage={setPage} />;
  } else if (page === "degree") {
    return <DegreePage goToPage={setPage} />;
  } else if (page === "document") {
    return <DocumentPage goToPage={setPage} />;
  } else if (page === "processing") {
    return <ProcessingPage />;
  } else if (page === "reject") {
    return <RejectPage goToPage={setPage} />;
  } else {
    return null;
  }
};

const EmailPage: React.FC<BasicWizardFormProps> = ({ goToPage }) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext<TeacherSignUpFormValues>();
  const onSubmit: SubmitHandler<TeacherSignUpFormValues> = async ({
    email,
  }) => {
    try {
      const { validationToken } = await postToIssueTeacherSignUp(email);
      setValue("emailValidationToken", validationToken);
      goToPage("code");
    } catch (error) {
      setError("email", { message: error?.response?.data?.messages?.[0] });
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeading>??????????????????</FormHeading>
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
        disabled={!isValid || isSubmitting}
        as="button"
        type="submit"
        buttonStyle="primary"
        fill
      >
        ??????
      </Button>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "text-center", "mt-8", "lg:mt-10")}
      >
        ?????????????????????
        <Link to="/sign_in" className={classNames("text-primary")}>
          ??????
        </Link>
      </Fonts>
    </Form>
  );
};

const CodePage: React.FC<BasicWizardFormProps> = ({ goToPage }) => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    formState: { errors, isValid },
  } = useFormContext<TeacherSignUpFormValues>();
  const { counter, restart } = useCounter(30);

  const onSubmit: SubmitHandler<TeacherSignUpFormValues> = async ({
    emailValidationCode,
    emailValidationToken,
  }) => {
    try {
      await postToVerifyCode(
        "email",
        emailValidationCode,
        emailValidationToken
      );
      goToPage("password");
    } catch (error) {
      const errorMessage = error?.response?.data?.messages?.[0];
      setError("emailValidationCode", {
        message: errorMessage || "????????????????????????????????????",
      });
    }
  };

  const resendValidationCode = async () => {
    const email = getValues("email");
    const { validationToken } = await postToIssueTeacherSignUp(email);
    setValue("emailValidationToken", validationToken);
    restart();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeading>????????????</FormHeading>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "mt-3", "lg:mt-4")}
      >
        ?????????????????????{" "}
        <span className={classNames("text-primary")}>{watch("email")}</span>
        <br />
        ?????????????????????????????? 6 ???????????????
        <br />
        ??????????????????????????????????????????????????????
      </Fonts>
      <div className={classNames("my-8", "lg:my-10")}>
        <Flexbox align="start">
          <FormLabel>6 ???????????????</FormLabel>
          <Fonts
            as="button"
            type="button"
            fontSize="secondaryBody"
            className={classNames(
              "text-primary",
              "ml-auto",
              "disabled:text-grey2",
              "disabled:cursor-not-allowed"
            )}
            disabled={counter !== 0}
            onClick={resendValidationCode}
          >
            {counter !== 0 ? `${counter}s ???????????????` : "????????????"}
          </Fonts>
        </Flexbox>
        <TextField
          error={isSet(errors["emailValidationCode"])}
          placeholder="6 ???????????????"
          inputMode="numeric"
          register={register("emailValidationCode", {
            required,
            validate: codeValidate,
          })}
        />
        <FormErrorMessage errors={errors} name="emailValidationCode" />
      </div>
      <Button
        disabled={!isValid}
        as="button"
        type="submit"
        buttonStyle="primary"
        fill
      >
        ??????
      </Button>
      <Fonts
        as="button"
        type="button"
        fontSize="secondaryBody"
        className={classNames(
          "text-primary",
          "text-center",
          "mt-8",
          "mx-auto",
          "block",
          "lg:mt-10"
        )}
        onClick={() => goToPage("email")}
      >
        ????????????
      </Fonts>
    </Form>
  );
};

const PasswordPage: React.FC<BasicWizardFormProps> = ({ goToPage }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useFormContext<TeacherSignUpFormValues>();

  const onSubmit: SubmitHandler<TeacherSignUpFormValues> = () => {
    goToPage("info");
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeading>????????????</FormHeading>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "mt-3", "lg:mt-4")}
      >
        ??????????????????????????????????????? 8 ~ 20 ??????
      </Fonts>
      <div className={classNames("mt-8", "mb-4", "lg:mb-6")}>
        <FormLabel>??????</FormLabel>
        <TextField
          autoComplete="new-password"
          error={isSet(errors["pwd"])}
          placeholder="??????"
          type="password"
          register={register("pwd", {
            required,
            validate: passwordValidate,
          })}
        />
        <FormErrorMessage errors={errors} name="pwd" />
      </div>
      <div className={classNames("mb-8", "lg:mb-10")}>
        <FormLabel>????????????</FormLabel>
        <TextField
          autoComplete="new-password"
          error={isSet(errors["confirmPassword"])}
          placeholder="????????????"
          type="password"
          register={register("confirmPassword", {
            required,
            validate: (value) =>
              value === watch("pwd") ? undefined : "??????????????????",
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
        ?????????
      </Button>
    </Form>
  );
};

const InfoPage: React.FC<BasicWizardFormProps> = ({ goToPage }) => {
  const [showPictureSample, setShowPictureSample] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors, isValid },
  } = useFormContext<TeacherSignUpFormValues>();

  const watchPhone = watch("phone");
  const watchIsPhoneConfirmed = watch("isPhoneConfirmed");
  const watchBirthYear = watch("birthYear");
  const watchBirthMonth = watch("birthMonth");

  const { value: promoteRewardAmount } = useAsync(
    async () =>
      await postToGetSysConfigs(["TEACHER_PROMOTE_REWARD"]).then(
        (res) => res[0].configValue
      ),
    []
  );

  const {
    prompt,
    showAsyncPrompt,
    handleClose,
    handleConfirm,
    forceStopAsyncPrompt,
  } = useAsyncPrompt<string, undefined>();
  const { isOk, resultHandler } = useIsOk();

  const verifySMSHandler = async () => {
    const phoneValidationCode = await prompt();

    if (isSet(phoneValidationCode)) {
      try {
        const phoneValidationToken = getValues("phoneValidationToken");
        await postToVerifyCode(
          "phone",
          phoneValidationCode,
          phoneValidationToken
        );
        setValue("phoneValidationCode", phoneValidationCode);
        setValue("isPhoneConfirmed", true);
        await resultHandler(true);
      } catch (error) {
        setValue("isPhoneConfirmed", false);
        await resultHandler(false);
        await verifySMSHandler();
      }
    } else {
      setValue("isPhoneConfirmed", false);
    }
  };

  const issuePhoneSignUpHandler = async () => {
    try {
      const emailValidationCode = getValues("emailValidationCode");
      const emailValidationToken = getValues("emailValidationToken");
      const phone = getValues("phone");

      const { phoneValidationToken } = await postToIssueTeacherSignUp({
        emailValidationCode,
        emailValidationToken,
        phone,
      });
      setValue("phoneValidationToken", phoneValidationToken);
      window.localStorage.setItem(
        keys.TEACHER_PHONE_ISSUE_TOKEN,
        phoneValidationToken
      );
    } catch (e) {
      forceStopAsyncPrompt();
      const message = getErrorMessageFromResponse(e);
      setError("phone", { message });
      throw e;
    }
  };

  const onPhoneChangeClick = () => {
    setValue("isPhoneConfirmed", false);
    setValue("phoneValidationToken", "");
    setValue("phoneValidationCode", "");
  };

  const onSubmit: SubmitHandler<TeacherSignUpFormValues> = async ({
    profilePicture,
    promoteCode,
  }) => {
    try {
      if (isSet(promoteCode) && isNotEmptyString(promoteCode)) {
        const {
          data: { valid },
        } = await getToCheckingPromoteCode(promoteCode);
        if (!valid) {
          // noinspection ExceptionCaughtLocallyJS
          throw "????????????????????????";
        }
      }
      const emailValidationCode = getValues("emailValidationCode");
      const emailValidationToken = getValues("emailValidationToken");
      const phoneValidationCode = getValues("phoneValidationCode");
      const phoneValidationToken = getValues("phoneValidationToken");
      const profilePictureId = await new FileUploader("teacher", {
        emailValidationCode,
        emailValidationToken,
        phoneValidationCode,
        phoneValidationToken,
      })
        .getResult(profilePicture)
        .then((res) => res?.id);
      setValue("profilePictureId", profilePictureId);

      goToPage("degree");
    } catch (e) {
      const message =
        typeof e === "string" ? e : getErrorMessageFromResponse(e);
      if (message === "????????????????????????") {
        setError("promoteCode", { message });
      }
    }
  };

  return (
    <React.Fragment>
      <PhoneNumberValidation
        show={showAsyncPrompt}
        phone={watchPhone}
        issuePhoneSignUpHandler={issuePhoneSignUpHandler}
        submitHandler={handleConfirm}
        cancelHandler={handleClose}
      />
      <PictureSample
        show={showPictureSample}
        onClose={() => setShowPictureSample(false)}
      />
      <IsOkModal
        isOk={isOk}
        success={{
          text: "????????????",
          image: SuccessIcon,
        }}
        failure={{
          text: "????????????",
          image: FailureIcon,
        }}
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Flexbox align="baseline">
          <FormHeading>??????????????????</FormHeading>
          <Fonts
            as="span"
            fontSize="secondaryBody"
            className={classNames("ml-auto", "text-red")}
          >
            *???????????????
          </Fonts>
        </Flexbox>
        <Fonts
          fontSize="title"
          className={classNames(
            "text-grey1",
            "mt-8",
            "mb-4",
            "lg:mt-10",
            "lg:mb-6"
          )}
        >
          ????????????
        </Fonts>
        <div className={classNames("mb-8", "lg:mb-10")}>
          <FormLabel>????????????</FormLabel>
          <Controller
            control={control}
            name="profilePicture"
            render={({ field: { ref, ...field } }) => (
              <PersonalPhotoField
                buttonType="secondary"
                customRef={ref}
                {...field}
              />
            )}
          />
          <Fonts
            fontSize="secondaryBody"
            className={classNames("text-grey2", "mt-4")}
          >
            ????????????????????????????????????????????????????????????????????????????????????????????????????????????
            <button
              onClick={() => setShowPictureSample(true)}
              type="button"
              className={classNames("text-primary")}
            >
              ??????????????????
            </button>
          </Fonts>
        </div>
        <Flexbox className={classNames("mb-4", "lg:mb-6")}>
          <div className={classNames("mr-4")}>
            <FormLabel required>??????</FormLabel>
            <TextField
              error={isSet(errors["surName"])}
              placeholder="??????"
              register={register("surName", {
                required,
              })}
            />
            <FormErrorMessage errors={errors} name="surName" />
          </div>
          <div>
            <FormLabel required>??????</FormLabel>
            <TextField
              error={isSet(errors["givenName"])}
              placeholder="??????"
              register={register("givenName", {
                required,
              })}
            />
            <FormErrorMessage errors={errors} name="givenName" />
          </div>
        </Flexbox>
        <div className={classNames("mb-4", "lg:mb-6")}>
          <FormLabel required>??????</FormLabel>
          <TextField
            error={isSet(errors["nickName"])}
            placeholder="??????"
            register={register("nickName", {
              required,
            })}
          />
          <FormErrorMessage errors={errors} name="nickName" />
        </div>
        <div className={classNames("mb-4", "lg:mb-6")}>
          <FormLabel required>??????</FormLabel>
          <Controller
            control={control}
            name="gender"
            render={({ field: { ref, ...field } }) => (
              <Dropdown options={genderOptions} {...field} />
            )}
          />
          <FormErrorMessage errors={errors} name="gender" />
        </div>
        <div className={classNames("mb-4", "lg:mb-6")}>
          <FormLabel required>??????</FormLabel>
          <BirthdayField
            birthYearRegister={register("birthYear", {
              required,
              validate: birthYearValidate,
            })}
            birthMonthRegister={register("birthMonth", {
              required,
              validate: birthMonthValidate,
            })}
            birthDateRegister={register("birthDate", {
              required,
              validate: birthDateValidate(watchBirthYear, watchBirthMonth),
            })}
          />
          {errors["birthYear"] ? (
            <FormErrorMessage errors={errors} name="birthYear" />
          ) : errors["birthMonth"] ? (
            <FormErrorMessage errors={errors} name="birthMonth" />
          ) : errors["birthDate"] ? (
            <FormErrorMessage errors={errors} name="birthDate" />
          ) : null}
        </div>
        <Div className={classNames("mb-8", "lg:mb-10")}>
          <FormLabel disableColor className={classNames("text-primary")}>
            # ???????????????
          </FormLabel>
          <TextField
            error={isSet(errors["promoteCode"])}
            placeholder="???????????????"
            register={register("promoteCode", {
              setValueAs: (value) => value.replace(/\s/g, ""),
            })}
          />
          <FormErrorMessage errors={errors} name={"promoteCode"} />
          <Fonts
            fontSize="secondaryBody"
            className={classNames("text-grey2", "mt-2")}
          >
            ?????????????????????????????? CLASS ???????????????????????????????????????{" "}
            {promoteRewardAmount} ?????????
          </Fonts>
        </Div>
        {/*<Fonts*/}
        {/*  fontSize="title"*/}
        {/*  className={classNames(*/}
        {/*    "text-grey1",*/}
        {/*    "mt-8",*/}
        {/*    "mb-4",*/}
        {/*    "lg:mt-10",*/}
        {/*    "lg:mb-6"*/}
        {/*  )}*/}
        {/*>*/}
        {/*  ????????????*/}
        {/*</Fonts>*/}
        {/*<div className={classNames("mb-8", "mb-12")}>*/}
        {/*  <FormLabel required>????????? / ????????? / ?????? ??????</FormLabel>*/}
        {/*  <Controller*/}
        {/*    control={control}*/}
        {/*    name="mainVerificationImage"*/}
        {/*    rules={{ required }}*/}
        {/*    render={({ field: { ref, ...field } }) => (*/}
        {/*      <DocumentField customRef={ref} {...field} />*/}
        {/*    )}*/}
        {/*  />*/}
        {/*  <FormErrorMessage errors={errors} name="mainVerificationImage" />*/}
        {/*  <Fonts*/}
        {/*    fontSize="secondaryBody"*/}
        {/*    className={classNames("text-grey2", "mt-2")}*/}
        {/*  >*/}
        {/*    ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/}
        {/*  </Fonts>*/}
        {/*</div>*/}
        <div className={classNames("mb-4", "mb-6")}>
          <FormLabel required>????????????</FormLabel>
          <PhoneField
            register={register("phone", {
              required,
              validate: phoneValidate,
            })}
            error={isSet(errors["phone"])}
            isConfirm={isTrue(watchIsPhoneConfirmed)}
            verifySMSHandler={verifySMSHandler}
            onPhoneChangeClick={onPhoneChangeClick}
            isPhoneNumberInvalid={isSet(phoneValidate(watchPhone))}
          />
          <FormErrorMessage errors={errors} name="phone" />
          <Fonts
            fontSize="secondaryBody"
            className={classNames("text-grey2", "mt-2")}
          >
            ??????????????????????????????????????????????????????????????????????????????????????????
          </Fonts>
        </div>
        <div>
          <FormLabel>???????????????????????????</FormLabel>
          <TextField
            placeholder="???????????????????????????"
            register={register("currentJobLocation")}
          />
        </div>
        <div className={classNames("my-8", "lg:my-10")}>
          <input
            id="acceptPolicy"
            type="checkbox"
            className={classNames("mr-1")}
            {...register("acceptPolicy", {
              required: true,
              validate: (value) => (value === true ? undefined : "???????????????"),
            })}
          />
          <Fonts
            htmlFor="acceptPolicy"
            as="label"
            fontSize="secondaryBody"
            className={classNames(
              "text-grey1",
              "hover-hover:hover:cursor-pointer"
            )}
          >
            ????????? CLASS ???{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/"
              className={classNames("text-primary")}
            >
              ????????????
            </a>{" "}
            ???{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/"
              className={classNames("text-primary")}
            >
              ????????????
            </a>
          </Fonts>
        </div>
        <Button
          disabled={!isValid || !watchIsPhoneConfirmed}
          as="button"
          type="submit"
          fill
          buttonStyle="primary"
        >
          ?????????
        </Button>
      </Form>
    </React.Fragment>
  );
};

const DEGREE_OPTIONS_KEY = ["??????", "?????????"];
const DegreePage: React.FC<BasicWizardFormProps> = ({ goToPage }) => {
  const [showSample, setShowSample] = useState<boolean>(false);

  const {
    formState: { errors, isValid },
    control,
    register,
    watch,
    handleSubmit,
    setValue,
    trigger,
  } = useFormContext<TeacherSignUpFormValues>();

  const watchDegreeId = watch("degreeId");
  const watchSchoolCityId = watch("degreeSchoolCityId");
  const isSchoolOutsideTW = watchSchoolCityId === 0;

  const { value: degreeOptions } = useAsync(
    async () =>
      await postToSearchOptions({
        parentIds: [],
        optionKey: "DEGREE",
      }).then((res) =>
        getOptionsFromServerOptions(res).filter((option) =>
          DEGREE_OPTIONS_KEY.includes(option.label)
        )
      ),
    []
  );
  const { value: schoolCityOptions } = useAsync(
    async () =>
      await postToSearchOptions({
        parentIds: [],
        optionKey: "CITY",
      }).then((res) =>
        getOptionsFromServerOptions([{ id: 0, name: "????????????" }, ...res])
      ),
    []
  );
  const { value: schoolOptions } = useAsync(
    async () =>
      isNotSet(watchSchoolCityId) || isNotSet(watchDegreeId)
        ? []
        : await postToSearchOptions({
            parentIds: [watchDegreeId, watchSchoolCityId],
            optionKey: "SCHOOL",
          }).then((res) => getOptionsFromServerOptions(res)),
    [watchSchoolCityId, watchDegreeId]
  );

  const onSubmit: SubmitHandler<TeacherSignUpFormValues> = () => {
    goToPage("document");
  };

  useEffect(() => {
    if (isSchoolOutsideTW) {
      setValue("degreeSchoolId", 0);
    } else {
      setValue("customSchoolName", undefined);
    }
    trigger();
  }, [isSchoolOutsideTW]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <IntroductionSample
        show={showSample}
        onClose={() => setShowSample(false)}
      />
      <FormHeading>???????????????????????????</FormHeading>
      <Fonts
        fontSize="title"
        className={classNames("text-grey1", "mt-8", "mt-10")}
      >
        ??????
      </Fonts>
      <div className={classNames("my-4", "lg:my-6")}>
        <FormLabel>????????????</FormLabel>
        <Controller
          control={control}
          name="degreeId"
          render={({ field: { ref, ...field } }) => (
            <Dropdown
              placeholder={"???????????????"}
              options={degreeOptions}
              {...field}
            />
          )}
        />
        <FormErrorMessage errors={errors} name="degree" />
      </div>
      <div className={classNames("mb-8", "lg:mb-10")}>
        <FormLabel>??????</FormLabel>
        <div className={"mb-4"}>
          <Controller
            control={control}
            rules={{ required }}
            name="degreeSchoolCityId"
            render={({ field: { ref, ...field } }) => (
              <Dropdown
                placeholder={"???????????????"}
                options={schoolCityOptions}
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Div condition={!isSchoolOutsideTW}>
            <Controller
              control={control}
              rules={{
                validate: !isSchoolOutsideTW ? requiredOption : undefined,
              }}
              name="degreeSchoolId"
              render={({ field: { ref, ...field } }) => (
                <Dropdown searchable options={schoolOptions} {...field} />
              )}
            />
          </Div>
          <TextField
            register={register("customSchoolName", {
              required: isSchoolOutsideTW ? required : false,
            })}
            condition={isSchoolOutsideTW}
          />
        </div>
        <FormErrorMessage errors={errors} name="degreeSchoolName" />
      </div>
      <Fonts
        fontSize="title"
        className={classNames("text-grey1", "mb-4", "lg:mb-6")}
      >
        ????????????
      </Fonts>
      <div className={classNames("mb-8")}>
        <Fonts
          fontSize="secondaryBody"
          className={classNames("text-grey2", "mb-2")}
        >
          ??????????????????????????????????????????????????????????????? 5 ???
        </Fonts>
        <Controller
          control={control}
          name="specializeSubjectIds"
          defaultValue={[]}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <SubjectSelection {...field} error={isSet(error)} />
          )}
        />
      </div>
      <Fonts
        fontSize="title"
        className={classNames("text-grey1", "mb-4", "lg:mb-6")}
      >
        ????????????
      </Fonts>
      <div className={classNames("mb-8", "lg:mb-10")}>
        <Fonts
          fontSize="secondaryBody"
          className={classNames("text-grey2", "mb-2")}
        >
          ???????????????????????????????????????????????????????????????????????????
        </Fonts>
        <TextareaField register={register("selfIntroduction")} />
        <Flexbox justify="between" className={classNames("mt-2")}>
          <Fonts className={classNames("text-grey2")} fontSize="secondaryBody">
            {watch("selfIntroduction")?.length || 0}/500
          </Fonts>
          <Fonts
            as="button"
            fontSize="secondaryBody"
            type="button"
            className={classNames("text-primary")}
            onClick={() => setShowSample(true)}
          >
            ??????????????????
          </Fonts>
        </Flexbox>
      </div>
      <Flexbox>
        <Button
          as="button"
          type="button"
          buttonStyle="primary"
          className={classNames("mr-4", "lg:mr-6")}
          onClick={() => goToPage("info")}
        >
          ?????????
        </Button>
        <Button
          as="button"
          type="submit"
          buttonStyle="primary"
          fill
          disabled={!isValid}
        >
          ?????????
        </Button>
      </Flexbox>
    </Form>
  );
};

const DocumentPage: React.FC<BasicWizardFormProps> = ({ goToPage }) => {
  const { control, handleSubmit } = useFormContext<TeacherSignUpFormValues>();
  const { userProfile } = useTeacherAuth.useContainer();

  const onSubmit: SubmitHandler<TeacherSignUpFormValues> = async (
    formValues
  ) => {
    if (isSet(userProfile)) {
      const updatePayload = await getTeacherUpdateProfilePayload(formValues);
      await putToUpdateTeacherPendingProfile(updatePayload);
      await putToCommitTeacherProfile();
    } else {
      const signUpPayload = await getTeacherSignUpPayload(formValues);
      await postToSignUpTeacher(signUpPayload);
    }
    goToPage("processing");
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeading>??????????????????</FormHeading>
      <Fonts
        fontSize="title"
        className={classNames(
          "text-grey1",
          "mt-8",
          "mb-4",
          "lg:mt-10",
          "lg:mb-6"
        )}
      >
        ??????
      </Fonts>
      <div className={classNames("mb-4", "lg:mb-6")}>
        <FormLabel>??????????????????</FormLabel>
        <Controller
          control={control}
          name="degreeImage"
          render={({ field: { ref, ...field } }) => (
            <DocumentField customRef={ref} {...field} />
          )}
        />
      </div>
      <div className={classNames("mb-4", "lg:mb-6")}>
        <FormLabel>????????? / ??????????????? ??????</FormLabel>
        <Controller
          control={control}
          name="studentCardOrTranscriptImage"
          render={({ field: { ref, ...field } }) => (
            <DocumentField customRef={ref} {...field} />
          )}
        />
      </div>
      <div className={classNames("mb-4", "lg:mb-6")}>
        <FormLabel>?????????</FormLabel>
        <Controller
          control={control}
          name="teacherLicenseImage"
          render={({ field: { ref, ...field } }) => (
            <DocumentField customRef={ref} {...field} />
          )}
        />
      </div>
      <div className={classNames("mb-4", "lg:mb-10")}>
        <FormLabel>??????????????????</FormLabel>
        <Controller
          control={control}
          name="otherProveFiles"
          defaultValue={[]}
          render={({ field: { ref, ...field } }) => (
            <DocumentField multiple customRef={ref} {...field} />
          )}
        />
        <Fonts
          fontSize="secondaryBody"
          className={classNames("text-grey2", "my-2")}
        >
          ???????????????????????????????????????......??????????????????????????????
        </Fonts>
      </div>
      <Flexbox className={classNames("text-primary", "mb-8", "lg:mb-10")}>
        <Flexbox
          justify="center"
          align="center"
          className={classNames("w-10", "h-10", "text-2xl", "mr-2")}
        >
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </Flexbox>
        <Fonts fontSize="secondaryBody" className={classNames("flex-1")}>
          ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        </Fonts>
      </Flexbox>
      <Flexbox>
        <Button
          as="button"
          type="button"
          buttonStyle="primary"
          className={classNames("mr-4", "lg:mr-6")}
          onClick={() => goToPage("degree")}
        >
          ?????????
        </Button>
        <Button as="button" type="submit" buttonStyle="primary" fill>
          ????????????
        </Button>
      </Flexbox>
    </Form>
  );
};

const ProcessingPage: React.FC = () => {
  const { value } = useAsync(
    async () =>
      await postToGetSysConfigs(["TEACHER_QUIZ_LINK"]).then((res) => res[0])
  );

  return (
    <Form>
      <FormHeading className={classNames("mb-3", "lg:mb-4")}>
        ???????????????
        <span className={classNames("text-[#fc9245]", "ml-2")}>
          <FontAwesomeIcon icon={faUserCheck} />
        </span>
      </FormHeading>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "mb-8", "lg:mb-10")}
      >
        ???????????? CLASS???????????????????????????????????????
        <br />
        ?????????????????????????????? CLASS ?????????????????????????????????
        <span className={classNames("text-primary")}>
          ???????????????????????????????????????????????????????????????
        </span>
        <br />
        <br />
        ???????????????3-5???????????????????????????email????????????????????????????????????????????????????????????????????????????????????
      </Fonts>
      <Button
        buttonStyle="primary"
        as={"a"}
        href="https://intro.weclass.com.tw/"
        target={"_blank"}
        rel="noreferrer noopener"
        className={classNames("mb-4", "lg:mb-6")}
      >
        ??????????????????
      </Button>
      <Button
        buttonStyle="primary"
        as={"a"}
        href={value?.configValue}
        target={"_blank"}
        rel="noreferrer noopener"
        fill
      >
        ????????????
      </Button>
    </Form>
  );
};

const RejectPage: React.FC<BasicWizardFormProps> = ({ goToPage }) => {
  return (
    <Form>
      <FormHeading className={classNames("mb-3", "lg:mb-4")}>
        ????????????
        <span className={classNames("text-red", "ml-2")}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </FormHeading>
      <Fonts
        fontSize="secondaryBody"
        className={classNames("text-grey2", "mb-5")}
      >
        ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
      </Fonts>
      <Button
        buttonStyle="primary"
        fill
        as="button"
        type="button"
        onClick={() => goToPage("info")}
      >
        ??????????????????
      </Button>
    </Form>
  );
};
