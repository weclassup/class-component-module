import React from "react";
import classNames from "classnames";

import Flexbox from "../Flexbox/Flexbox";
import Logo from "../../assets/cls-nav-logo-img.svg";

export const Header: React.FC<{ className?: string; disableZIndex?: boolean }> =
  ({ children, className, disableZIndex = false }) => {
    return (
      <Flexbox
        as="header"
        justify="start"
        align="center"
        className={classNames(
          className,
          "w-full",
          "py-2",
          "px-4",
          "pr-2",
          "bg-white",
          "border-b",
          "border-grey4",
          "border-solid",
          disableZIndex ? "" : "z-50",
          "sticky",
          "top-0",
          "lg:px-10",
          "lg:py-4"
        )}
      >
        <Flexbox
          className={classNames("w-[120px]", "h-[30px]", "lg:w-40", "lg:h-10")}
        >
          <img
            src={Logo}
            alt="logo"
            className={classNames("w-full", "h-full", "object-contain")}
          />
        </Flexbox>
        {children}
      </Flexbox>
    );
  };

export default Header;
