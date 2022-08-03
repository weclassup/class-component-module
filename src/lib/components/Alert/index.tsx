import React from "react";
import Modal from "../Modal/Modal";
import classNames from "classnames";
import Fonts from "../Fonts/Fonts";
import Flexbox from "../Flexbox/Flexbox";
import Button from "../Button/Button";
import * as formatChecker from "../../helper/format.checker";

interface Props {
  alert: boolean;
  confirmHandler?: () => void;
  cancelHandler?: () => void;
  btnText?: { confirm?: string; cancel?: string };
}

interface TitleProps {
  title: string;
  renderTitle?: undefined;
}

interface RenderTitleProps {
  title?: undefined;
  renderTitle: React.ComponentType;
}

interface ContentProps {
  content: string;
  renderContent?: undefined;
}

interface RenderContentProps {
  content?: undefined;
  renderContent: React.ComponentType;
}

export const Alert: React.FC<
  Props & (TitleProps | RenderTitleProps) & (ContentProps | RenderContentProps)
> = ({ alert, cancelHandler, confirmHandler, btnText, ...props }) => {
  return (
    <Modal visible={alert} className={classNames("px-6")}>
      <div
        className={classNames(
          "max-w-[25rem]",
          "w-full",
          "p-6",
          "bg-white",
          "rounded-xl",
          "lg:p-10"
        )}
      >
        {formatChecker.isSet(props.title) ? (
          <Fonts
            as={"h1"}
            fontSize={"primaryHeading"}
            className={classNames("mb-3", "lg:mb-4")}
          >
            {props.title}
          </Fonts>
        ) : formatChecker.isSet(props.renderTitle) ? (
          <props.renderTitle />
        ) : null}
        {formatChecker.isSet(props.content) ? (
          <Fonts
            fontSize={"secondaryBody"}
            className={classNames("text-grey2", "mb-8", "lg:mb-10")}
          >
            {props.content}
          </Fonts>
        ) : formatChecker.isSet(props.renderContent) ? (
          <props.renderContent />
        ) : null}
        <Flexbox>
          <Button
            condition={formatChecker.isSet(cancelHandler)}
            onClick={cancelHandler}
            buttonStyle={"primary"}
            type={"button"}
            className={classNames({
              "mr-6": formatChecker.isSet(confirmHandler),
            })}
          >
            {btnText?.cancel || "取消"}
          </Button>
          <Button
            condition={formatChecker.isSet(confirmHandler)}
            onClick={confirmHandler}
            buttonStyle={"primary"}
            type={"button"}
            fill
          >
            {btnText?.confirm || "確定"}
          </Button>
        </Flexbox>
      </div>
    </Modal>
  );
};
