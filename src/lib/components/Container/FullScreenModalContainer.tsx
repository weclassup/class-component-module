import React, { ReactElement } from "react";
import Modal from "../Modal/Modal";
import FontIconButton from "../Button/FontIconButton";
import Flexbox from "../Flexbox/Flexbox";
import FontIcon from "../Icon/FontIcon";
import Fonts from "../Fonts/Fonts";
import classNames from "classnames";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { isNotEmptyString, isNotSet, isSet } from "../../helper/format.checker";

interface FullScreenModalContainerProps {
  open: boolean;
  closeHandler: () => void;
  headingIcon?: IconDefinition;
  heading: string;
  className?: string;
  headerClassName?: string;
  containerClassName?: string;
  tailingHeading?: ReactElement;
  modalIndex?: number;
}

export const FullScreenModalContainer: React.FC<
  FullScreenModalContainerProps
> = ({
  children,
  open,
  closeHandler,
  heading,
  headerClassName,
  headingIcon,
  containerClassName,
  tailingHeading,
  modalIndex,
}) => {
  return (
    <Modal
      disableDefaultZIndex
      visible={open}
      className={classNames(
        "md:py-10",
        "md:px-[104px]",
        isNotSet(modalIndex) && "z-20"
      )}
      style={{ zIndex: modalIndex }}
    >
      <div
        className={classNames(
          containerClassName || [
            "relative",
            "h-stretch",
            "md:w-full",
            "md:max-h-full",
            "md:h-auto",
            "md:flex",
            "lg:w-[35rem]",
          ]
        )}
      >
        <FontIconButton
          onClick={closeHandler}
          fontProps={{ icon: faTimes }}
          className={classNames(
            "hidden",
            "md:block",
            "absolute",
            "-right-2",
            "top-2",
            "text-2xl",
            "transform",
            "translate-x-full",
            "text-white"
          )}
        />
        <Flexbox
          direction="col"
          className={classNames(
            "bg-white",
            "w-screen",
            "h-stretch",
            "md:w-full",
            "md:h-auto",
            "md:rounded-xl",
            "md:overflow-scroll"
          )}
        >
          <Flexbox
            justify="center"
            align="center"
            as="header"
            className={classNames(
              "relative",
              "border-b",
              "border-solid",
              "border-grey4",
              "py-4",
              "md:py-0",
              "md:justify-start",
              isNotEmptyString(heading) && ["md:px-20", "md:pt-12"],
              "md:border-0",
              headerClassName
            )}
          >
            <h1
              className={classNames(
                "min-h-[1.5rem]",
                "text-base",
                "font-bold",
                "text-center",
                "text-grey1",
                "md:hidden"
              )}
            >
              {heading}
            </h1>
            <FontIcon
              condition={isSet(headingIcon)}
              className={classNames(
                "hidden",
                "md:flex",
                "text-[2rem]",
                "mr-2",
                "text-grey1"
              )}
              fontProps={{ icon: headingIcon! }}
            />
            <Fonts
              condition={isNotEmptyString(heading)}
              as="h1"
              fontSize="primaryHeading"
              className={classNames("hidden", "md:block", "text-grey1")}
            >
              {heading}
            </Fonts>
            {tailingHeading}
            <FontIconButton
              onClick={closeHandler}
              fontProps={{ icon: faTimes }}
              className={classNames(
                "absolute",
                "right-2",
                "text-2xl",
                "md:hidden"
              )}
            />
          </Flexbox>
          {children}
        </Flexbox>
      </div>
    </Modal>
  );
};
