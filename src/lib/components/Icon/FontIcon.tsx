import React from "react";
import classNames from "classnames";

import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { Flexbox } from "../..";

type FontProps = FontAwesomeIconProps;
type SpanProps = JSX.IntrinsicElements["span"];

interface Props extends SpanProps {
  fontProps: FontProps;
  condition?: boolean;
  defaultSize?: boolean;
}

export const FontIcon: React.FC<Props> = ({
  fontProps,
  className,
  condition = true,
  defaultSize = true,
  ...props
}) => {
  if (!condition) return null;
  return (
    <Flexbox
      justify="center"
      align="center"
      as="span"
      {...props}
      className={classNames(defaultSize && ["w-10", "h-10"], className)}
    >
      <FontAwesomeIcon {...fontProps} />
    </Flexbox>
  );
};

export default FontIcon;
