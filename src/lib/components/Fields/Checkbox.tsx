import React, { forwardRef } from "react";
import classNames from "classnames";

import { ConditionalFragment, Flexbox } from "../../";

export const Checkbox = forwardRef<
  HTMLInputElement,
  Omit<JSX.IntrinsicElements["input"], "type"> & { label: string; name: string }
>(({ className, label, children, ...props }, ref) => {
  return (
    <Flexbox align={"center"} className={classNames(className)}>
      <input
        className={classNames("hidden")}
        type={"checkbox"}
        {...props}
        ref={ref}
        id={`checkbox-${props.name}`}
      />
      <Flexbox as={"label"} htmlFor={`checkbox-${props.name}`} align={"center"}>
        <Flexbox
          align={"center"}
          justify={"center"}
          className={classNames(
            "mr-2",
            "w-4 h-4",
            "border border-solid rounded-cl",
            { "border-grey3": !props.checked, "border-primary": props.checked }
          )}
        >
          <ConditionalFragment condition={props.checked}>
            <div
              className={classNames("w-2.5 h-2.5", "rounded-cl", "bg-primary")}
            />
          </ConditionalFragment>
        </Flexbox>
        {label}
      </Flexbox>
    </Flexbox>
  );
});

export default Checkbox;
