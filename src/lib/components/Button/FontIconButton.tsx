import React, { forwardRef } from "react";
import classNames from "classnames";

import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

type FontProps = FontAwesomeIconProps;
interface Props extends ButtonProps {
  fontProps: FontProps;
  condition?: boolean;
  defaultSize?: boolean;
}

export const FontIconButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      fontProps,
      className,
      condition = true,
      defaultSize = true,
      children,
      ...props
    },
    ref
  ) => {
    if (!condition) return null;

    return (
      <button
        {...props}
        className={classNames(defaultSize && ["w-10", "h-10"], className)}
        ref={ref}
      >
        <FontAwesomeIcon {...fontProps} />
        {children}
      </button>
    );
  }
);

export default FontIconButton;
