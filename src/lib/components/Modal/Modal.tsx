import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import Flexbox from "../Flexbox/Flexbox";

type DivProps = JSX.IntrinsicElements["div"];

interface Props extends Omit<DivProps, "onClick"> {
  visible: boolean;
  onBackdrop?: DivProps["onClick"];
  disableDefaultZIndex?: boolean;
  backdrop?: "invisible" | "transparent";
}

export const Modal: React.FC<Props> = ({
  children,
  visible,
  onBackdrop,
  className,
  backdrop = "transparent",
  disableDefaultZIndex,
  ...props
}) => {
  const clickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation();
      onBackdrop?.(e);
    },
    [onBackdrop]
  );
  if (!visible) return null;

  return createPortal(
    <Flexbox
      onClick={clickHandler}
      align="center"
      justify="center"
      className={classNames(
        className,
        "bg-black",
        {
          "bg-opacity-60": backdrop === "transparent",
          "bg-opacity-100": backdrop === "invisible",
        },
        "w-screen",
        "h-stretch",
        { "z-[999]": !disableDefaultZIndex },
        "fixed",
        "top-0",
        "left-0"
      )}
      {...props}
    >
      {children}
    </Flexbox>,
    document.querySelector("#root")!
  );
};

export default Modal;
