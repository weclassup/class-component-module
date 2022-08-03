import React, { useRef, useState } from "react";
import classNames from "classnames";
import { ClassRouteProps, Routes } from "../../tools/route.generator";

import { isSet } from "../../helper/format.checker";

import { faChevronDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Flexbox from "../Flexbox/Flexbox";
import Fonts from "../Fonts/Fonts";
import { Link } from "react-router-dom";

interface Props {
  closeHandler: () => void;
  routes: Routes;
}

export const DrawerNavigationList: React.FC<Props> = ({
  routes,
  closeHandler,
}) => {
  return (
    <nav>
      <ul
        className={classNames(
          "py-2",
          "px-6",
          "border-b",
          "border-solid",
          "border-grey4"
        )}
      >
        {routes.map((route) => (
          <NavigationItem
            key={route.title}
            {...route}
            closeHandler={closeHandler}
          />
        ))}
      </ul>
    </nav>
  );
};

interface LinkItem extends ClassRouteProps {
  closeHandler: () => void;
}

const NavigationItem: React.FC<LinkItem> = ({
  title,
  routes,
  closeHandler,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <li key={title} className={classNames("mb-2", "last:mb-0")}>
      <Flexbox
        onClick={() => setOpen((prev) => !prev)}
        align="center"
        justify="between"
        className={classNames("h-12")}
      >
        <Fonts fontSize="primaryButton" className={classNames("text-grey1")}>
          {title}
        </Fonts>
        <Flexbox
          align="center"
          justify="center"
          className={classNames("w-10", "h-10", "text-grey1", "text-lg")}
        >
          <FontAwesomeIcon
            className={classNames(
              "transition-transform",
              "duration-500",
              "transform",
              {
                "rotate-180": open,
              }
            )}
            icon={faChevronDown}
          />
        </Flexbox>
      </Flexbox>
      <div
        ref={ref}
        style={{ height: open ? ref.current?.scrollHeight : 0 }}
        className={classNames(
          "overflow-hidden",
          "transition-height",
          "duration-500"
        )}
      >
        <ul
          className={classNames(
            "py-6",
            "border-t",
            "border-b",
            "border-solid",
            "border-grey4"
          )}
        >
          {routes?.map((route) => (
            <SubLinkItem
              {...route}
              closeHandler={closeHandler}
              key={route.title}
            />
          ))}
        </ul>
      </div>
    </li>
  );
};

const SubLinkItem: React.FC<LinkItem> = ({ to, title, closeHandler }) => {
  return (
    <Flexbox
      condition={isSet(to)}
      className={classNames("mb-6", "last:mb-0")}
      key={title}
    >
      <Link
        to={to || "/"}
        className={classNames("w-full")}
        onClick={closeHandler}
      >
        <Fonts fontSize="primaryBody" className={classNames("text-grey1")}>
          {title}
        </Fonts>
      </Link>
    </Flexbox>
  );
};
