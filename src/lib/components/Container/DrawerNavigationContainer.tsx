import React from "react";
import classNames from "classnames";
import {BasicUserInformation, FadeInContainer, Flexbox, Fonts, Image,} from "../../index";

import {faUser} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/pro-regular-svg-icons";

interface Props
    extends PickAsNullable<BasicUserInformation,
        "nickName" | "profilePicture" | "email"> {
  open: boolean;
  closeHandler: () => void;
  signOutHandler: () => void;
}

export const DrawerNavigationContainer: React.FC<Props> = ({
  open,
  closeHandler,
  signOutHandler,
  children,
  nickName,
  profilePicture,
  email,
}) => {
  return (
    <FadeInContainer
        open={open}
        closeHandler={closeHandler}
        className={classNames("z-[1]", 'overflow-scroll')}
    >
      <UserInformation
        nickName={nickName}
        profilePicture={profilePicture}
        email={email}
      />
      {children}
      <Fonts
        as="button"
        type="button"
        onClick={signOutHandler}
        fontSize="primaryButton"
        className={classNames(
          "text-grey2",
          "leading-[3rem]",
          "px-6",
          "w-full",
          "text-left"
        )}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className={classNames("mr-2")} />
        登出
      </Fonts>
    </FadeInContainer>
  );
};

const UserInformation: React.FC<
  PickAsNullable<BasicUserInformation, "nickName" | "profilePicture" | "email">
> = ({ nickName, profilePicture, email }) => {
  return (
    <Flexbox
      align="center"
      className={classNames(
        "py-4",
        "px-6",
        "border-b",
        "border-solid",
        "border-grey4"
      )}
    >
      <Image
        className={classNames(
          "w-10",
          "h-10",
          "rounded-cl",
          "border",
          "border-grey3",
          "border-solid",
          "mr-4"
        )}
        src={profilePicture?.url}
        imagePlaceholder={
          <Flexbox
            align="end"
            justify="center"
            className={classNames(
              "w-full",
              "h-full",
              "text-3xl",
              "text-grey3",
              "bg-grey4"
            )}
          >
            <FontAwesomeIcon icon={faUser} />
          </Flexbox>
        }
      />
      <Flexbox direction="col">
        <Fonts fontSize="primaryButton" className={classNames("text-grey1")}>
          {nickName}
        </Fonts>
        <Fonts fontSize="secondaryButton" className={classNames("text-grey2")}>
          {email}
        </Fonts>
      </Flexbox>
    </Flexbox>
  );
};
