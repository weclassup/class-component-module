import React from "react";
import classNames from "classnames";

import { faUser } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flexbox, Image } from "../../";

interface Props {
  url?: string | undefined;
  className?: string;
  iconClassName?: string;
  defaultSize?: boolean;
}
export const UserProfilePicture: React.FC<Props> = ({
  url,
  defaultSize = true,
  iconClassName,
  className,
}) => {
  return (
    <Image
      className={classNames(
        className,
        defaultSize && ["w-8", "h-8"],
        "rounded-cl",
        "border",
        "border-grey3",
        "border-solid"
      )}
      src={url}
      imagePlaceholder={
        <Flexbox
          align="end"
          justify="center"
          className={classNames(
            "w-full",
            "h-full",
            iconClassName || ["text-xl"],
            "text-grey3",
            "bg-grey4"
          )}
        >
          <FontAwesomeIcon icon={faUser} />
        </Flexbox>
      }
    />
  );
};
