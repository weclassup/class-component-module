import { ValidationMap } from "prop-types";
import React, { WeakValidationMap } from "react";

export { studentClassAPI, teacherClassAPI } from "./api/class.api";

export { classMoment } from "./classMoment/index";

export { Alert } from "./components/Alert";

export { AuthorizeUI } from "./components/AuthorizeUI/AuthorizeUI";

export { Breadcrumbs } from "./components/Breadcrumbs";

export { Button, LinkButton } from "./components/Button/Button";
export { FontIconButton } from "./components/Button/FontIconButton";
export { HambButton } from "./components/Button/HambButton";

export { Calendar } from "./components/Calendar/Calendar";

export { ChattingRoom } from "./components/ChattingRoom";

export { ConditionalFragment } from "./components/ConditionalFragment";

export {
  Container,
  ScreenContainer,
  SecondaryModalContainer,
} from "./components/Container/Container";
export { DrawerNavigationContainer } from "./components/Container/DrawerNavigationContainer";
export { FadeInContainer } from "./components/Container/FadeInContainer";
export { FormPageContainer } from "./components/Container/FormPageContainer";
export { FullScreenModalContainer } from "./components/Container/FullScreenModalContainer";

export { ContentPreviewSection } from "./components/ContentPreviewSection";

export { DrawerNavigationList } from "./components/DrawerNavigationList";

export { Dropdown } from "./components/Dropdown/Dropdown";

export { Div } from "./components/Element/Div";

export { BirthdayField } from "./components/Fields/BirthdayField";
export { Checkbox } from "./components/Fields/Checkbox";
export { DocumentField } from "./components/Fields/DocumentField";
export { PersonalPhotoField } from "./components/Fields/PersonalPhotoField";
export { PhoneField } from "./components/Fields/PhoneField";
export { SubjectSelection } from "./components/Fields/SubjectSelection";
export { TextField } from "./components/Fields/TextField";
export { TextareaField } from "./components/Fields/TextareaField";

export { FileListForCard } from "./components/FileList";

export { FilePreviewer } from "./components/FilePreviewer";

export { Flexbox } from "./components/Flexbox/Flexbox";

export { Fonts } from "./components/Fonts/Fonts";

export { Form } from "./components/Form/Form";
export { FormErrorMessage } from "./components/Form/FormErrorMessage";
export { FormHeading } from "./components/Form/FormHeading";
export { FormLabel } from "./components/Form/FormLabel";

export { Header } from "./components/Header/Header";

export { HeaderNavigationList } from "./components/HeaderNavigationList";

export { HeaderUserInformation } from "./components/HeaderUserInformation";

export { FontIcon } from "./components/Icon/FontIcon";

export { Image } from "./components/Image/Image";
export { UserProfilePicture } from "./components/Image/UserProfilePicture";

export { InScreenNavigationSidebar } from "./components/InScreenNavigationSidebar";

export { Loader } from "./components/Loader/Loader";

export { Modal } from "./components/Modal/Modal";

export { default as NotificationBell } from "./components/NotificationBell";

export { PhoneNumberValidation } from "./components/PhoneNumberValidation/PhoneNumberValidation";

export { Portal } from "./components/Portal/Portal";

export { PreviewSwiper } from "./components/PreviewSwiper";

export { QuickReplies } from "./components/QuickReplies";

export { RouteWithSubRoutes } from "./components/RouteWithSubRoutes/RouteWithSubRoutes";

export {
  QuestionStatusLabel,
  MatchTypeLabel,
  Label,
  SubjectLabel,
} from "./components/StatusLabel";

export { TabContainer, SecondaryTabContainer } from "./components/TabContainer";
export type { TabItem, TabProps } from "./components/TabContainer";

export { UList, uListEventEmitter } from "./components/UList";

export { ZoomInPreviewer } from "./components/ZoomInPreviewer";

export { classEvent, loadingEventEmitter } from "./events/class.event";

export * as axiosHelper from "./helper/axios.helper";
export * as elementHelper from "./helper/element.helper";
export * as errorMessage from "./helper/error.message";
export * as fileHelper from "./helper/file.helper";
export type { FileType } from "./helper/file.helper";
export { FileUploader } from "./helper/file.uploader";
export * as formatChecker from "./helper/format.checker";
export * as locationHelper from "./helper/location.helper";
export * as momentHelper from "./helper/moment.helper";
export * as objectHandler from "./helper/object.handler";
export * as sleep from "./helper/sleep";
export * as stringHandler from "./helper/string.handler";
export * as validator from "./helper/validator";

export { useAsyncPrompt } from "./hooks/useAsyncPrompt/useAsyncPrompt";
export { useCalendar, dayname } from "./hooks/useCalendar/useCalendar";
export { useChattingMessage } from "./hooks/useChattingMessage";
export { useInteractiveOutsideTargetHandler } from "./hooks/useInteractiveOutsideTargetHandler/useInteractiveOutsideTargetHandler";
export { useCounter } from "./hooks/useCounter/useCounter";
export { useFileSourceHandler } from "./hooks/useFileSourceHandler";
export { useGetQuestionExpiration } from "./hooks/useGetQuestionExpiration";
export { useInterval } from "./hooks/useInterval/useInterval";
export { useIsOk, IsOkModal } from "./hooks/useIsOk/useIsOk";
export { useOnEndReach } from "./hooks/useOnEndReach";
export { usePaginationFn } from "./hooks/usePagenationFn";
export { usePreventDefaultScroll } from "./hooks/usePreventDefaultScroll/usePreventDefaultScroll";
export { useWebSocket } from "./hooks/useWebSocket";

export type { StudentProfile } from "./store/useStudentAuth";
export { useStudentAuth } from "./store/useStudentAuth";
export type { TeacherProfile } from "./store/useTeacherAuth";
export { useTeacherAuth } from "./store/useTeacherAuth";

export { RouteGenerator } from "./tools/route.generator";
export type {
  ClassRouteProps,
  RouteWithSubRoutesRenderProps,
  Routes,
} from "./tools/route.generator";

export { turnPageHandler } from "./tools/turn.page.handler";

export {
  getQuestionExpireAtUTCFormat,
  getQuestionRestTime,
  getRestTime,
} from "./utils/data.convertor";

export { history } from "./history";

declare global {
  export interface FCWithoutComponent<P = {}> {
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  export type ButtonProps = JSX.IntrinsicElements["button"];

  export type AuthType = "student" | "teacher" | undefined;

  export type Gender = "MALE" | "FEMALE" | "OTHER";

  interface PageDto<Item extends Record<string, any>> {
    atPage: number;
    items: Item[];
    totalCount: number;
    totalPages: number;
  }

  interface SearchOptions<K extends Record<string, any> = {}> {
    paging: {
      page: number;
      pageSize: number;
    };
    sorting?: {
      sort: "ASC" | "DESC";
      sortFields: DeepKeyof<K>[];
    };
    sorts?: {
      field?: DeepKeyof<K>;
      sort?: "ASC" | "DESC";
    }[];
  }

  // utils
  type PickAsNullable<T, K extends keyof T> = {
    [P in K]: T[P] | undefined;
  };

  type DeepKeyof<T, Prefix extends string = never> = T extends
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined
    | ((...args: any) => any)
    ? never
    : {
        [K in keyof T & string]: [Prefix] extends [never]
          ? K | `['${K}']` | DeepKeyof<T[K], K>
          :
              | `${Prefix}.${K}`
              | `${Prefix}['${K}']`
              | DeepKeyof<T[K], `${Prefix}.${K}` | `${Prefix}['${K}']`>;
      }[keyof T & string];
}

export interface BasicUserInformation {
  id: number;
  birthday: string;
  email: string;
  gender: Gender;
  nickName: string;
  givenName: string;
  profilePicture: S3File | undefined;
  profilePictureId: number | undefined;
  surName: string;
}

export interface S3File {
  contentType: string;
  id: number;
  name: string;
  size?: number;
  url?: string;
}

export interface IssueUploadResponse {
  id: number;
  uploadUrl: string;
}

export interface IssueBeforeSignUpConfig {
  commitFileUploadReq:
    | {
        relateType: string;
        relateTypeId: number;
      }
    | {};
  emailValidationCode: string;
  emailValidationToken: string;
  issueFileUploadReq: {
    contentDisposition: string;
    contentType: string;
    name: string;
    size?: number;
  };
  phoneValidationCode: string;
  phoneValidationToken: string;
}

export interface DropdownOption<K extends string = string> {
  key: number | boolean | null | undefined | K;
  label: string;
  active?: boolean;
  optionItemRender?: React.ComponentType;
  displayItemRender?: React.ComponentType;
}

declare module "axios" {
  export interface AxiosRequestConfig {
    disableLoader?: boolean;
    showErrorAlert?: boolean;
  }
}
