import React from "react";
import classNames from "classnames";
import Fonts from "../Fonts/Fonts";

export const FormLabel: React.FC<{
  className?: React.HTMLAttributes<HTMLElement>["className"];
  required?: boolean;
  disableColor?: boolean;
}> = ({ children, className, required = false, disableColor }) => {
  return (
    <Fonts
      as="label"
      fontSize="secondaryBody"
      className={classNames(
        !disableColor && "text-grey2",
        "mb-2",
        "block",
        className
      )}
    >
      {children}
      <Fonts
        as="span"
        fontSize="secondaryBody"
        condition={required}
        className={classNames("text-red")}
      >
        *
      </Fonts>
    </Fonts>
  );
};

export default FormLabel;
