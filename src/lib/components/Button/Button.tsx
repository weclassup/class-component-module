import React, { createElement, useMemo } from "react";
import classNames from "classnames";
import { Link, LinkProps } from "react-router-dom";
import { isSet } from "../../helper/format.checker";

interface BasicProps {
  buttonFonts?: "primary" | "secondary";
  defaultSize?: boolean;
  condition?: boolean;
}

type ButtonElementProps = JSX.IntrinsicElements["button"];

interface ButtonProps extends ButtonElementProps {
  as?: "button";
}

type AElementProps = JSX.IntrinsicElements["a"];

interface AProps extends AElementProps {
  as?: "a";
}

interface ButtonStyle {
  fill?: boolean;
  buttonStyle?: "primary" | "secondary" | "red" | "green";
}

type MainProps = ButtonProps | AProps;
type Props = ButtonStyle & MainProps & BasicProps;

export const Button: React.FC<Props> = ({
  className,
  children,
  fill,
  buttonStyle,
  buttonFonts = "primary",
  as = "button",
  defaultSize = true,
  condition = true,
  ...props
}) => {
  const _className = useMemo(() => {
    return classNames(
      className,
      "flex",
      "items-center",
      "justify-center",
      "rounded-sm",
      "disabled:text-grey3",
      "hover-hover:hover:cursor-pointer",
      "hover-hover:hover:bg-opacity-70",
      { "hover-hover:hover:opacity-70": !fill },
      isSet(buttonStyle) && ["border-solid", "border"],
      buttonStyle === "primary" && [
        fill ? ["bg-primary", "text-white"] : ["text-primary"],
        "border-primary",
      ],
      buttonStyle === "secondary" && ["border-grey2", "text-grey2"],
      buttonStyle === "red" && [
        fill ? ["bg-red", "text-white"] : ["text-red"],
        "border-red",
      ],
      buttonStyle === "green" && [
        fill ? ["bg-green", "text-white"] : ["text-green"],
        "border-green",
      ],
      fill
        ? ["disabled:bg-grey5", "disabled:border-grey5"]
        : ["disabled:border-grey4"],
      buttonFonts === "primary" && ["text-[1rem]", "font-medium"],
      buttonFonts === "secondary" && ["text-[0.875rem]", "font-medium"],
      defaultSize && ["w-full", "h-12"]
    );
  }, [className, fill, buttonStyle, buttonFonts, defaultSize]);

  if (!condition) return null;

  return createElement(as, { className: _className, ...props }, children);
};

export default Button;

interface LinkButtonProps extends LinkProps {
  isRouter?: boolean;
}

export const LinkButton: React.FC<LinkButtonProps & ButtonStyle & BasicProps> =
  ({
    className,
    children,
    buttonStyle,
    fill,
    buttonFonts,
    defaultSize,
    condition = true,
    ...props
  }) => {
    const _className = useMemo(() => {
      return classNames(
        className,
        "flex",
        "items-center",
        "justify-center",
        "rounded-sm",
        "disabled:text-grey3",
        "hover-hover:hover:cursor-pointer",
        "hover-hover:hover:bg-opacity-70",
        { "hover-hover:hover:opacity-70": !fill },
        isSet(buttonStyle) && ["border-solid", "border"],
        buttonStyle === "primary" && [
          fill ? ["bg-primary", "text-white"] : ["text-primary"],
          "border-primary",
        ],
        buttonStyle === "secondary" && ["border-grey2", "text-grey2"],
        buttonStyle === "red" && [
          fill ? ["bg-red", "text-white"] : ["text-red"],
          "border-red",
        ],
        buttonStyle === "green" && [
          fill ? ["bg-green", "text-white"] : ["text-green"],
          "border-green",
        ],
        fill
          ? ["disabled:bg-grey5", "disabled:border-grey5"]
          : ["disabled:border-grey4"],
        buttonFonts === "primary" && ["text-[1rem]", "font-medium"],
        buttonFonts === "secondary" && ["text-[0.875rem]", "font-medium"],
        defaultSize && ["w-full", "h-12"]
      );
    }, [className, fill, buttonStyle, buttonFonts, defaultSize]);

    if (!condition) return null;

    return (
      <Link {...props} className={_className}>
        {children}
      </Link>
    );
  };
