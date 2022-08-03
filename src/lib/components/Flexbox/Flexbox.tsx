import classNames from "classnames";
import merge from "lodash.merge";
import { createElement, HTMLAttributes, useMemo } from "react";

type Main = JSX.IntrinsicElements["main"];
interface MainProps extends Main {
  as?: "main";
}

interface DefaultProps extends Div {
  as?: undefined;
}

export type Div = JSX.IntrinsicElements["div"];
interface DivProps extends Div {
  as?: "div";
}

type Footer = JSX.IntrinsicElements["footer"];
interface FooterProps extends Footer {
  as?: "footer";
}

type Header = JSX.IntrinsicElements["header"];
interface HeaderProps extends Header {
  as?: "header";
}

type Li = JSX.IntrinsicElements["li"];
interface LiProps extends Li {
  as?: "li";
}

type UL = JSX.IntrinsicElements["ul"];
interface ULProps extends UL {
  as?: "ul";
}

type OL = JSX.IntrinsicElements["ol"];
interface OLProps extends OL {
  as?: "ol";
}

type Nav = JSX.IntrinsicElements["nav"];
interface NavProps extends Nav {
  as?: "nav";
}

type Span = JSX.IntrinsicElements["span"];
interface SpanProps extends Span {
  as?: "span";
}

type Label = JSX.IntrinsicElements["label"];
interface LabelProps extends Label {
  as?: "label";
}

type Form = JSX.IntrinsicElements["form"];
interface FormProps extends Form {
  as?: "form";
}

type ElementProps =
  | MainProps
  | DivProps
  | DefaultProps
  | FooterProps
  | HeaderProps
  | LiProps
  | ULProps
  | OLProps
  | NavProps
  | SpanProps
  | LabelProps
  | FormProps;

interface Props {
  condition?: boolean;
  direction?: "row" | "col";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  expand?: boolean;
  shrink?: boolean;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  customRef?: ElementProps["ref"];
}

export const Flexbox: React.FC<Props & ElementProps> = ({
  as = "div",
  condition = true,
  children,
  className,
  direction,
  justify,
  align,
  expand,
  shrink,
  wrap,
  customRef,
  ...props
}) => {
  const _className = useMemo<HTMLAttributes<HTMLElement>["className"]>(
    () =>
      classNames(
        className,
        "flex",
        {
          "flex-shrink-0": shrink,
          "flex-wrap": wrap === "wrap",
          "flex-wrap-reverse": wrap === "wrap-reverse",
          "flex-nowrap": wrap === "nowrap",
        },
        {
          "flex-row": direction === "row",
          "flex-col": direction === "col",
        },
        {
          "justify-start": justify === "start",
          "justify-end": justify === "end",
          "justify-center": justify === "center",
          "justify-between": justify === "between",
          "justify-around": justify === "around",
          "justify-evenly": justify === "evenly",
        },
        {
          "items-start": align === "start",
          "items-end": align === "end",
          "items-center": align === "center",
          "items-baseline": align === "baseline",
          "items-stretch": align === "stretch",
        },
        { "flex-1": expand }
      ),
    [className, direction, justify, align, expand, shrink, wrap]
  );

  if (!condition) return null;

  return createElement(
    as,
    merge({}, { className: _className, ...props }, { ref: customRef }),
    children
  );
};

export default Flexbox;
