import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { ConditionalFragment, Flexbox, Fonts, formatChecker } from "../../";

export interface TabItem {
  label: string;
  pageKey: string;
  render: React.FC<any>;
  tabRightSide?: React.ComponentType;
  tabLeftSide?: React.ComponentType;
}

interface Props {
  items: TabItem[];
  defaultTabIndex?: number;
  getCurrentTabLabel?: (title: string) => void;
  onTabChanged?: () => void;
  //
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  //
  containerClassName?: string;
  //
  outermostContainerClassName?: string;
  //
  disableTabBottomLine?: boolean;
  fontSize?: ComponentProps<typeof Fonts>["fontSize"];
}

export const PureTabContainer: React.FC<Props> = ({
  items,
  onTabChanged,
  defaultTabIndex = 0,
  getCurrentTabLabel,

  disableTabBottomLine,

  containerClassName,
  outermostContainerClassName,

  fontSize,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
}) => {
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    setPage(items[defaultTabIndex].pageKey);
  }, [defaultTabIndex]);

  useEffect(() => {
    if (formatChecker.isSet(getCurrentTabLabel)) {
      const label = items.find(({ pageKey }) => pageKey === page)?.label;
      if (formatChecker.isSet(label)) {
        getCurrentTabLabel(label);
      }
    }

    if (formatChecker.isSet(onTabChanged)) {
      onTabChanged();
    }
  }, [page]);

  const Content = useMemo(
    () => items.find((item) => item.pageKey === page)?.render || (() => null),
    [page, items]
  );

  return (
    <div className={classNames(outermostContainerClassName)}>
      <Flexbox as={"ul"} className={classNames(containerClassName)}>
        {items.map((item) => (
          <Tab
            tabClassName={tabClassName}
            activeTabClassName={activeTabClassName}
            inactiveTabClassName={inactiveTabClassName}
            key={item.pageKey}
            {...item}
            changeHandler={setPage}
            isCurrent={page === item.pageKey}
            disableTabBottomLine={disableTabBottomLine}
            fontSize={fontSize}
          />
        ))}
      </Flexbox>
      <Content />
    </div>
  );
};

export interface TabProps extends TabItem {
  changeHandler: (pageKey: string) => void;
  isCurrent: boolean;
  tabClassName?: string;
  disableTabBottomLine?: boolean;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  fontSize?: ComponentProps<typeof Fonts>["fontSize"];
}

const Tab: React.FC<TabProps> = ({
  pageKey,
  label,
  changeHandler,
  isCurrent,
  tabLeftSide,
  tabRightSide,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
  disableTabBottomLine,
  fontSize,
}) => {
  return (
    <li key={pageKey}>
      <Fonts
        as={"button"}
        type={"button"}
        onClick={() => changeHandler(pageKey)}
        fontSize={fontSize || "primaryButton"}
        className={classNames(
          tabClassName,
          isCurrent ? activeTabClassName : inactiveTabClassName
        )}
      >
        {tabLeftSide && React.createElement(tabLeftSide)}
        {label}
        {tabRightSide && React.createElement(tabRightSide)}
        <ConditionalFragment condition={!disableTabBottomLine}>
          <span
            className={classNames(
              "absolute",
              "block",
              "h-[3px]",
              "bg-primary",
              "bottom-0",
              "transition-width",
              "duration-300",
              isCurrent ? "w-full" : "w-0"
            )}
          />
        </ConditionalFragment>
      </Fonts>
    </li>
  );
};

interface TabContainerProps
  extends Pick<
    Props,
    | "items"
    | "defaultTabIndex"
    | "getCurrentTabLabel"
    | "onTabChanged"
    | "containerClassName"
    | "tabClassName"
  > {}

export const TabContainer: React.FC<TabContainerProps> = ({
  containerClassName,
  tabClassName,
  ...props
}) => {
  return (
    <PureTabContainer
      {...props}
      outermostContainerClassName={classNames("w-full", "md:px-10")}
      containerClassName={classNames(
        "px-6",
        "bg-white",
        containerClassName || "w-full",
        "md:rounded-sm",
        "overflow-scroll"
      )}
      tabClassName={classNames(
        "relative flex items-center justify-center",
        "px-2",
        tabClassName ?? "h-12 min-w-[6.25rem]",
        "whitespace-pre"
      )}
      activeTabClassName={classNames("text-primary")}
      inactiveTabClassName={classNames("text-grey2")}
    />
  );
};

export const SecondaryTabContainer: React.FC<TabContainerProps> = ({
  containerClassName,
  tabClassName,
  ...props
}) => {
  return (
    <PureTabContainer
      {...props}
      containerClassName={classNames(
        "mx-auto",
        "w-fit",
        "bg-white",
        "rounded-[0.5rem]",
        "overflow-hidden"
      )}
      tabClassName={classNames("w-20 md:w-[7.5rem] h-10")}
      activeTabClassName={classNames("bg-primary", "text-white")}
      inactiveTabClassName={classNames("text-grey2")}
      fontSize={"secondaryBody"}
      disableTabBottomLine
    />
  );
};
