import React, { createElement, useRef } from "react";
import classNames from "classnames";

// paragraph
type P = JSX.IntrinsicElements["p"];
interface ParagraphProps extends P {
  as?: "p";
}
type H1 = JSX.IntrinsicElements["h1"];
interface H1Props extends H1 {
  as?: "h1";
}
type H2 = JSX.IntrinsicElements["h2"];
interface H2Props extends H2 {
  as?: "h2";
}
type H3 = JSX.IntrinsicElements["h3"];
interface H3Props extends H3 {
  as?: "h3";
}
type H4 = JSX.IntrinsicElements["h4"];
interface H4Props extends H4 {
  as?: "h4";
}
type H5 = JSX.IntrinsicElements["h5"];
interface H5Props extends H5 {
  as?: "h5";
}
type H6 = JSX.IntrinsicElements["h6"];
interface H6Props extends H6 {
  as?: "h6";
}

type Span = JSX.IntrinsicElements["span"];
interface SpanProps extends Span {
  as?: "span";
}

type Label = JSX.IntrinsicElements["label"];
interface LabelProps extends Label {
  as?: "label";
}

type A = JSX.IntrinsicElements["a"];
interface AProps extends A {
  as?: "a";
}

type Button = JSX.IntrinsicElements["button"];
interface ButtonProps extends Button {
  as?: "button";
}

type Li = JSX.IntrinsicElements["li"];
interface LiProps extends Li {
  as?: "li";
}

type ElementProps =
  | ParagraphProps
  | H1Props
  | H2Props
  | H3Props
  | H4Props
  | H5Props
  | H6Props
  | SpanProps
  | LabelProps
  | AProps
  | ButtonProps
  | LiProps;

type Props = ElementProps & {
  condition?: boolean;
  responsible?: boolean;
  disableDefaultSize?: boolean;
  /**
   * @value primaryHeading - ["text-[2rem]", "font-bold"]
   * @value secondaryHeading - ["text-[1.75rem]", "font-bold"]
   * @value title - ["text-[1.125rem]", "font-bold"]
   * @value primaryBody - ["text-[1rem]", "font-normal"]
   * @value secondaryBody - ["text-[0.875rem]", "font-normal"]
   * @value tiny - ["text-[0.75rem]", "font-normal"]
   * @value primaryButton - ["text-[1rem]", "font-medium"]
   * @value secondaryButton - ["text-[0.875rem]", "font-medium"]
   */
  fontSize?:
    | "primaryHeading"
    | "secondaryHeading"
    | "title"
    | "primaryBody"
    | "secondaryBody"
    | "tiny"
    | "primaryButton"
    | "secondaryButton";
};

export const Fonts: React.FC<Props> = ({
  children,
  condition = true,
  responsible = true,
  as = "p",
  fontSize,
  className,
  disableDefaultSize,
  ...props
}) => {
  const defaultSize = useRef(
    disableDefaultSize ? undefined : fontSize ? fontSize : "primaryBody"
  ).current;
  const _className = React.useMemo<
    React.HTMLAttributes<HTMLElement>["className"]
  >(
    () =>
      classNames(
        className,
        defaultSize === "primaryHeading" && [
          "text-[1.75rem]",
          "font-bold",
          responsible && "md:text-[2rem]",
        ],
        defaultSize === "secondaryHeading" && [
          "text-[1.5rem]",
          "font-bold",
          responsible && "tmd:ext-[1.75rem]",
        ],
        defaultSize === "title" && [
          "text-[1rem]",
          "font-bold",
          responsible && "md:text-[1.125rem]",
        ],
        defaultSize === "primaryBody" && ["text-[1rem]", "font-normal"],
        defaultSize === "secondaryBody" && ["text-[0.875rem]", "font-normal"],
        defaultSize === "tiny" && ["text-[0.75rem]", "font-normal"],
        defaultSize === "primaryButton" && ["text-[1rem]", "font-medium"],
        defaultSize === "secondaryButton" && ["text-[0.875rem]", "font-medium"]
      ),
    [className, fontSize, responsible]
  );

  if (!condition) return null;

  return createElement(as, { className: _className, ...props }, children);
};

export default Fonts;
