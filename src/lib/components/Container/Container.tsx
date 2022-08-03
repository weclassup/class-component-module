import React, { ComponentType } from "react";
import classNames from "classnames";
import { Button, Flexbox, Fonts, formatChecker, Modal } from "../../";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const Container: React.FC = ({ children }) => {
  return (
    <div className={classNames("min-h-screen", "bg-bg-blue", "relative")}>
      {children}
    </div>
  );
};

export default Container;

interface ScreenContainerProps {
  heading?: string;
  className?: string;
  contentClassName?: string;
}
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  className,
  contentClassName,
  heading,
}) => {
  return (
    <main
      className={classNames(
        className,
        "w-full",
        "lg:max-h-[calc(100vh-73px)]",
        "lg:overflow-scroll"
      )}
    >
      <Fonts
        condition={formatChecker.isString(heading)}
        as={"h1"}
        fontSize={"primaryButton"}
        className={classNames("px-6", "py-4", "md:px-10")}
      >
        {heading}
      </Fonts>
      <div className={contentClassName}>{children}</div>
    </main>
  );
};

interface SecondaryModalContainerProps {
  open: boolean;
  closeHandler: () => void;
  disableConfirm?: boolean;
  disableCancel?: boolean;
  confirmHandler: React.MouseEventHandler<HTMLButtonElement>;
  cancelHandler: React.MouseEventHandler<HTMLButtonElement>;
  confirmText: string;
  cancelText: string;
  headerClassName?: string;
  contentClassName?: string;
  btnGroupClassName?: string;
  containerClassName?: string;
}
interface SecondaryModalContainerIconHeaderProps {
  icon: IconDefinition;
  heading: string;
  renderHeader?: undefined;
}
interface SecondaryModalContainerRenderHeaderProps {
  icon?: undefined;
  heading?: undefined;
  renderHeader: ComponentType;
}
export const SecondaryModalContainer: React.FC<
  SecondaryModalContainerProps &
    (
      | SecondaryModalContainerIconHeaderProps
      | SecondaryModalContainerRenderHeaderProps
    )
> = ({
  children,
  open,
  closeHandler,
  cancelHandler,
  confirmHandler,
  confirmText,
  cancelText,
  contentClassName,
  headerClassName,
  btnGroupClassName,
  containerClassName,
  ...props
}) => {
  return (
    <Modal visible={open} className={classNames("py-6")}>
      <Flexbox
        direction={"col"}
        className={classNames(
          containerClassName || [
            "w-[17rem]",
            "h-stretch",
            "bg-white",
            "rounded-xl",
            "md:h-fit",
            "md:max-h-full",
            "md:w-[35rem]",
            "lg:py-12",
            "lg:px-20",
            "lg:overflow-scroll",
          ]
        )}
      >
        <Fonts
          as={"h1"}
          fontSize={"primaryHeading"}
          className={classNames(
            headerClassName || [
              "border-b",
              "border-solid",
              "border-grey4",
              "px-[1.375rem]",
              "pt-6",
              "pb-3",
              "flex-shrink-0",
              "lg:p-0",
              "lg:border-0",
            ]
          )}
        >
          {props.renderHeader ? (
            <props.renderHeader />
          ) : (
            <React.Fragment>
              <FontAwesomeIcon
                icon={props.icon}
                className={classNames("mr-2")}
              />
              {props.heading}
            </React.Fragment>
          )}
        </Fonts>
        <div
          className={classNames(
            contentClassName || [
              "flex-1",
              "p-6",
              "overflow-scroll",
              "lg:flex-none",
              "lg:p-0",
              "lg:py-10",
            ]
          )}
        >
          {children}
        </div>
        <Flexbox
          shrink={false}
          className={classNames(
            btnGroupClassName || [
              "border-t",
              "border-solid",
              "border-grey4",
              "p-6",
              "pt-4",
              "lg:p-0",
              "lg:border-0",
            ]
          )}
        >
          <Button
            buttonStyle={"primary"}
            type={"button"}
            className={classNames("mr-4", "lg:mr-6")}
            onClick={cancelHandler}
          >
            {cancelText}
          </Button>
          <Button
            buttonStyle={"primary"}
            type={"button"}
            fill
            onClick={confirmHandler}
          >
            {confirmText}
          </Button>
        </Flexbox>
      </Flexbox>
    </Modal>
  );
};
