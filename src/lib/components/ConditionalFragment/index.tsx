import React, { Fragment } from "react";

interface Props {
  condition?: boolean;
}

export const ConditionalFragment: React.FC<Props> = ({
  condition = true,
  children,
  ...props
}) => {
  if (!condition) return null;
  return <Fragment {...props}>{children}</Fragment>;
};

export default ConditionalFragment;
