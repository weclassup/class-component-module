import React, {useCallback, useEffect, useRef, useState} from "react";
import {Controller, FormProvider, SubmitHandler, useForm, useFormContext,} from "react-hook-form";
import {Link, useHistory} from "react-router-dom";
import classNames from "classnames";

import {codeValidate, emailValidate, passwordValidate, required,} from "../../../../../helper/validator";
import {isNotEmptyString, isSet} from "../../../../../helper/format.checker";

import useStudentAuth from "../../../../../store/useStudentAuth";
import useAsyncPrompt from "../../../../../hooks/useAsyncPrompt/useAsyncPrompt";
import {
    postToExchangeGoldRedeem,
    postToIssueStudentSignUp,
    postToSignUpStudent,
    postToVerifyCode,
    StudentSignUpForm,
} from "../../../../../api/student";
import useCounter from "../../../../../hooks/useCounter/useCounter";

import Form from "../../../../Form/Form";
import FormHeading from "../../../../Form/FormHeading";
import FormLabel from "../../../../Form/FormLabel";
import FormErrorMessage from "../../../../Form/FormErrorMessage";
import TextField from "../../../../Fields/TextField";
import Dropdown from "../../../../Dropdown/Dropdown";
import PersonalPhotoField from "../../../../Fields/PersonalPhotoField";
import StudentRegistrySuccessPrompt from "./StudentRegistrySuccessPrompt";

import FormPageContainer from "../../../../Container/FormPageContainer";
import Button from "../../../../Button/Button";
import Fonts from "../../../../Fonts/Fonts";
import Flexbox from "../../../../Flexbox/Flexbox";
import GiftIcon from "../../../../../assets/class_invitation_student_img.svg";

import {getDataFormObjectByKeys} from "../../../../../helper/object.handler";
import {useAsync} from "react-use";
import {getToCheckingPromoteCode, postToGetSysConfigs, postToSearchOptions} from "../../../../../api";
import {getOptionsFromServerOptions} from "../../../../../static.options";
import {getErrorMessageFromResponse} from "../../../../../helper/error.message";
import Image from "../../../../Image/Image";
import Modal from "../../../../Modal/Modal";
import Div from "../../../../Element/Div";

interface FormValues extends Omit<StudentSignUpForm, "birthday"> {
    email: string;
    confirmPassword: string;

    profilePicture: File;
    acceptPolicy: boolean;

    birthYear: string;
    birthMonth: string;
    birthDate: string;
}

const StudentRegistry = () => {
    const ref = useRef<HTMLDivElement>(null);
    const method = useForm({mode: "all"});
    return (
        <FormPageContainer customRef={ref}>
            <FormProvider {...method}>
                <WizardForm parentRef={ref.current}/>
            </FormProvider>
        </FormPageContainer>
    );
};

export default StudentRegistry;

type Page = "email" | "code" | "password" | "info";

interface BasicWizardFormProps {
    goToPage: (page: Page) => void;
}

const WizardForm: React.FC<{ parentRef: HTMLDivElement | null }> = ({
                                                                        parentRef,
                                                                    }) => {
    const [page, setPage] = useState<Page>("email");
    // const [page, setPage] = useState<Page>("info");

    useEffect(() => {
        if (!parentRef) return;
        parentRef.scrollIntoView();
        // eslint-disable-next-line
    }, [page]);

    if (page === "email") {
        return <EmailPage goToPage={setPage}/>;
    } else if (page === "code") {
        return <CodePage goToPage={setPage}/>;
    } else if (page === "password") {
        return <PasswordPage goToPage={setPage}/>;
    } else if (page === "info") {
        return <InfoPage goToPage={setPage}/>;
    } else {
        return null;
    }
};

const EmailPage: React.FC<BasicWizardFormProps> = ({goToPage}) => {
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: {errors, isValid, isSubmitting},
    } = useFormContext<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async ({email}) => {
        try {
            const {validationToken} = await postToIssueStudentSignUp(email);
            setValue("validationToken", validationToken);
            goToPage("code");
        } catch (error: any) {
            setError("email", {message: error?.response?.data?.messages?.[0]});
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
                <FormErrorMessage errors={errors} name="email"/>
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

const CodePage: React.FC<BasicWizardFormProps> = ({goToPage}) => {
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
        setError,
        formState: {errors, isValid, isSubmitting},
    } = useFormContext<FormValues>();
    const {counter, restart} = useCounter(30);

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        try {
            await postToVerifyCode(values.validationCode, values.validationToken);
            goToPage("password");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.messages?.[0];
            setError("validationCode", {
                message: errorMessage || "????????????????????????????????????",
            });
        }
    };

    const resendValidationCode = async () => {
        const email = getValues("email");
        const {validationToken} = await postToIssueStudentSignUp(email);
        setValue("validationToken", validationToken);
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
                <br/>
                ?????????????????????????????? 6 ???????????????
                <br/>
                ??????????????????????????????????????????????????????
            </Fonts>
            <div className={classNames("my-8", "lg:my-10")}>
                <Flexbox align="start">
                    <FormLabel>6 ???????????????</FormLabel>
                    <Fonts
                        as="button"
                        type="button"
                        fontSize="secondaryBody"
                        className={classNames("text-primary", "ml-auto")}
                        disabled={counter !== 0}
                        onClick={resendValidationCode}
                    >
                        {counter !== 0 ? `${counter}s ???????????????` : "????????????"}
                    </Fonts>
                </Flexbox>
                <TextField
                    error={isSet(errors["validationCode"])}
                    placeholder="6 ???????????????"
                    inputMode="numeric"
                    register={register("validationCode", {
                        required,
                        validate: codeValidate,
                    })}
                />
                <FormErrorMessage errors={errors} name="validationCode"/>
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

const PasswordPage: React.FC<BasicWizardFormProps> = ({goToPage}) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors, isValid},
    } = useFormContext<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async () => {
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
            <div className={classNames("mt-8", "mb-4", "lg:mt-10", "lg:mb-6")}>
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
                <FormErrorMessage errors={errors} name="pwd"/>
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
                <FormErrorMessage errors={errors} name="confirmPassword"/>
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

const InfoPage: React.FC<BasicWizardFormProps> = () => {
    const [isRedeemOpen, setIsRedeemOpen] = useState<boolean>(false);

    const history = useHistory();

    const {
        register,
        control,
        setError,
        handleSubmit,
        formState: {errors, isValid},
    } = useFormContext<FormValues>();

    const {prompt, handleConfirm, showAsyncPrompt} = useAsyncPrompt();
    const {getUserProfile, putToUpdateProfilePicture, setIsSignIn} =
        useStudentAuth.useContainer();

    const {value: learnPhaseOptions} = useAsync(
        async () =>
            await postToSearchOptions({
                optionKey: "LEARN_PHASE",
                parentIds: [],
            }).then(getOptionsFromServerOptions),
        []
    );
    const {value: promoteRewardAmount} = useAsync(
        async () =>
            await postToGetSysConfigs(["STUDENT_PROMOTE_REWARD"]).then(
                (res) => res[0].configValue
            ),
        []
    );

    const finishSignUpFlow = useCallback(async () => {
        setIsRedeemOpen(false);
        await prompt();
        setIsSignIn(true);
        history.push("/");
    }, []);

    const onSubmit: SubmitHandler<FormValues> = useCallback(
        async (formValues) => {
            const payload = getDataFormObjectByKeys(formValues, [
                "givenName",
                "surName",
                "nickName",
                "learnPhaseId",
                "pwd",
                "validationCode",
                "validationToken",
                "promoteCode"
            ]);

            try {
                if (isSet(payload.promoteCode) && isNotEmptyString(payload.promoteCode)) {
                    const {
                        data: {valid},
                    } = await getToCheckingPromoteCode(payload.promoteCode);
                    if (!valid) {
                        // noinspection ExceptionCaughtLocallyJS
                        throw "????????????????????????";
                    }
                }

                await postToSignUpStudent({
                    ...payload,
                });
                await getUserProfile();
                await putToUpdateProfilePicture(formValues.profilePicture);
                setIsRedeemOpen(true);
            } catch (e) {
                const message =
                    typeof e === "string" ? e : getErrorMessageFromResponse(e);
                if (message === "????????????????????????") {
                    setError("promoteCode", {message});
                }
            }
        },
        []
    );

    return (
        <React.Fragment>
            <RedeemModal isOpen={isRedeemOpen} finishSignUpFlow={finishSignUpFlow}/>
            <StudentRegistrySuccessPrompt
                show={showAsyncPrompt}
                onConfirm={() => handleConfirm(true)}
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
                        render={({field: {ref, ...field}}) => (
                            <PersonalPhotoField
                                buttonType="primary"
                                customRef={ref}
                                {...field}
                            />
                        )}
                    />
                </div>
                <Flexbox className={classNames("mb-4", "lg:mb-6")}>
                    <div className={classNames("mr-4", "lg:mr-6")}>
                        <FormLabel required>??????</FormLabel>
                        <TextField
                            error={isSet(errors["surName"])}
                            placeholder="??????"
                            register={register("surName", {
                                required,
                            })}
                        />
                        <FormErrorMessage errors={errors} name="surName"/>
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
                        <FormErrorMessage errors={errors} name="givenName"/>
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
                    <FormErrorMessage errors={errors} name="nickName"/>
                </div>
                <Fonts
                    fontSize="title"
                    className={classNames("text-grey1", "mb-4", "lg:mb-6")}
                >
                    ????????????
                </Fonts>
                <div className={classNames("mb-4", "lg:mb-6")}>
                    <FormLabel required>????????????</FormLabel>
                    <Controller
                        control={control}
                        rules={{required}}
                        name="learnPhaseId"
                        render={({field: {ref, ...field}}) => (
                            <Dropdown options={learnPhaseOptions} {...field} />
                        )}
                    />
                    <FormErrorMessage errors={errors} name="learnPhaseId"/>
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
                    <FormErrorMessage errors={errors} name={"promoteCode"}/>
                    <Fonts
                        fontSize="secondaryBody"
                        className={classNames("text-grey2", "mt-2")}
                    >
                        ?????????????????????????????? CLASS ???????????????????????????????????????{" "}
                        {promoteRewardAmount} ?????????
                    </Fonts>
                </Div>
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
                    disabled={!isValid}
                    as="button"
                    type="submit"
                    fill
                    buttonStyle="primary"
                >
                    ????????????
                </Button>
            </Form>
        </React.Fragment>
    );
};

const RedeemModal: React.FC<{
    isOpen: boolean;
    finishSignUpFlow: () => void;
}> = ({isOpen, finishSignUpFlow}) => {
    const [redeemCode, setRedeemCode] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
    }, [redeemCode]);

    const onRedeemClick = useCallback(async () => {
        try {
            await postToExchangeGoldRedeem(redeemCode);
            finishSignUpFlow();
        } catch (e) {
            const message =
                typeof e === "string" ? e : getErrorMessageFromResponse(e);
            setError(message);
        }
    }, [redeemCode]);

    return (
        <Modal visible={isOpen} className={classNames("p-6")}>
            <div
                className={classNames(
                    "pt-[2.625rem] px-6 pb-[1.875rem]",
                    "md:pt-14 md:pb-[2.625rem] md:px-16",
                    "w-full h-full",
                    "max-w-[470px] max-h-[650px]",
                    "bg-white",
                    "rounded-xl",
                    "overflow-scroll"
                )}
            >
                <Image
                    alt="redeem"
                    src={GiftIcon}
                    className={classNames(
                        "mb-4 mx-auto",
                        "md:mb-6",
                        "w-[180px] h-[140px]"
                    )}
                />
                <Fonts
                    fontSize={"secondaryHeading"}
                    className={classNames("mb-4 md:mb-6", "w-full")}
                >
                    ??????????????? 68??????
                </Fonts>
                <Fonts
                    fontSize={"primaryBody"}
                    className={classNames("mb-4 md:mb-6", "w-full")}
                >
                    ????????????Class??????
                    <br/>
                    ????????????????????????????????????????????????????????????
                </Fonts>
                <div className={classNames("mb-2")}>
                    <FormLabel className={classNames("text-primary")}>
                        # ?????????????????????
                    </FormLabel>
                    <TextField
                        error={isSet(error)}
                        value={redeemCode}
                        onChange={(e) => setRedeemCode(e.target.value)}
                    />
                    <Fonts
                        condition={isSet(error)}
                        fontSize="secondaryBody"
                        className={classNames("text-red", "mt-2")}
                    >
                        {error}
                    </Fonts>
                </div>
                <Fonts
                    fontSize={"primaryBody"}
                    className={classNames("mb-4 md:mb-6", "w-full", "text-grey2")}
                >
                    ???????????????????????????????????????????????????????????????????????????
                </Fonts>
                <Button
                    onClick={onRedeemClick}
                    as="button"
                    type="button"
                    buttonStyle="primary"
                    fill
                    className={classNames("mb-4 md:mb-6")}
                >
                    ????????????
                </Button>
                <Fonts
                    as={"button"}
                    type={"button"}
                    fontSize={"secondaryBody"}
                    className={classNames("block", "mx-auto", "text-primary")}
                    onClick={finishSignUpFlow}
                >
                    ?????????????????????????????????
                </Fonts>
            </div>
        </Modal>
    );
};
