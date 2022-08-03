import React from "react";
import { formatChecker, RouteWithSubRoutesRenderProps } from "../../";
import Flexbox from "../Flexbox/Flexbox";
import Fonts from "../Fonts/Fonts";
import classNames from "classnames";
import { NavLink } from "react-router-dom";

interface Props {
  routes: RouteWithSubRoutesRenderProps["routes"];
  title: string;
}

export const InScreenNavigationSidebar: React.FC<Props> = ({
  routes,
  title,
}) => {
  return (
    <aside
      className={classNames(
        "hidden",
        "lg:block",
        "min-h-[calc(100vh-73px)]",
        "bg-white",
        "w-[280px]",
        "p-10",
        "pr-6",
        "flex-shrink-0"
      )}
    >
      <Fonts
        fontSize="primaryButton"
        className={classNames("text-grey2", "mb-6")}
      >
        {title}
      </Fonts>
      <nav>
        <ul>
          {routes?.map((route) => (
            <Flexbox
              as="li"
              key={route.path}
              condition={formatChecker.isSet(route.to)}
            >
              <NavLink
                to={route.to || "/"}
                className={classNames(
                  "w-full",
                  "px-6",
                  "text-grey1",
                  "important"
                )}
                activeClassName={classNames(
                  "activeLink",
                  "bg-primary",
                  "bg-opacity-[0.06]",
                  "rounded-sm"
                )}
              >
                <Fonts
                  fontSize="primaryBody"
                  className={classNames("leading-[3rem]")}
                >
                  {route.title}
                </Fonts>
              </NavLink>
            </Flexbox>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
