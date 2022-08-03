import React, { useRef, useState } from "react";
import classNames from "classnames";
import {
  BasicUserInformation,
  Flexbox,
  Image,
  useInteractiveOutsideTargetHandler,
} from "../../";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/pro-solid-svg-icons";

interface Props extends Pick<BasicUserInformation, "profilePicture"> {
  className?: string;
}
export const HeaderUserInformation: React.FC<Props> = ({
  profilePicture,
  children,
  className,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useInteractiveOutsideTargetHandler(ref.current, () => setShow(false));

  return (
    <React.Fragment>
      <div
        className={classNames(
          "hidden",
          "lg:block",
          "relative",
          className || "ml-8"
        )}
      >
        <Image
          onClick={() => setShow((prev) => !prev)}
          className={classNames(
            "w-8",
            "h-8",
            "rounded-cl",
            "border",
            "border-grey3",
            "border-solid",
            "cursor-pointer"
          )}
          src={profilePicture?.url}
          imagePlaceholder={
            <Flexbox
              align="end"
              justify="center"
              onClick={() => setShow((prev) => !prev)}
              className={classNames(
                "w-full",
                "h-full",
                "text-2xl",
                "text-grey3",
                "bg-grey4"
              )}
            >
              <FontAwesomeIcon icon={faUser} />
            </Flexbox>
          }
        />
        <div
          ref={ref}
          style={{
            height: show ? ref.current?.scrollHeight : 0,
          }}
          className={classNames(
            "absolute",
            "bg-white",
            "w-[312px]",
            "right-0",
            "top-[52px]",
            "shadow-dropdown",
            "rounded-xl",
            "transition-height",
            "duration-500",
            "overflow-hidden"
          )}
        >
          {children}
        </div>
      </div>
    </React.Fragment>
  );
};
