import React from "react";
import classNames from "classnames";

interface Props {
  open: boolean;
  closeHandler: () => void;
  className?: string;
}

export const FadeInContainer: React.FC<Props> = ({
  open,
  children,
  className,
}) => {
  return (
    <div
      className={classNames(
        className,
        "fixed",
        "w-full",
        "h-stretch",
        "top-0",
        "left-0",
        "bg-white",
        "transition-transform",
        "transform",
        "duration-500",
        !open ? "translate-y-[calc(-100%)]" : "translate-y-[0]",
        "pt-[57px]",
        "lg:hidden"
      )}
    >
      {children}
    </div>
  );
};
