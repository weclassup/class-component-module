import React from "react";
import classNames from "classnames";
import { ClassRouteProps, Flexbox, Fonts, formatChecker } from "../../";
import { Link } from "react-router-dom";
import { MatchedRoute } from "react-router-config";

import { faChevronRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  matchedRoutes: MatchedRoute<any, ClassRouteProps>[];
  className?: string;
}
export const Breadcrumbs: React.FC<Props> = ({ matchedRoutes, className }) => {
  return (
    <Flexbox
      as={"ul"}
      align={"center"}
      className={classNames(className, "py-4", "px-6", "md:p-10", "md:pb-6")}
    >
      {matchedRoutes.map((route, idx, ary) => {
        if (idx === 0) return null;
        if (formatChecker.isNotSet(route.route.to) || idx === ary.length - 1)
          return (
            <Fonts
              key={idx}
              as={"li"}
              fontSize={"primaryButton"}
              className={classNames("leading-[1.5rem]")}
            >
              {route.route.title}
            </Fonts>
          );

        return (
          <Fonts
            key={idx}
            as={"li"}
            fontSize={"primaryButton"}
            className={classNames("flex", "items-center", "leading-[1.5rem]")}
          >
            <Link to={route.route.to}>{route.route.title}</Link>
            <Flexbox
              as={"span"}
              justify={"center"}
              align={"center"}
              className={classNames("block", "w-4", "h-4", "mx-1")}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Flexbox>
          </Fonts>
        );
      })}
    </Flexbox>
  );
};
