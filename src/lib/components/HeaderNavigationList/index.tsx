import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Routes } from "../../tools/route.generator";
import { Fonts, formatChecker } from "../../";

export const HeaderNavigationList: React.FC<{ routes: Routes }> = ({
  routes,
}) => (
  <nav className={classNames("hidden", "lg:block", "ml-10")}>
    <ul className={classNames("flex")}>
      {routes.map((route) => (
        <Fonts
          key={route.path}
          as="li"
          fontSize="primaryButton"
          condition={formatChecker.isSet(route.to)}
          className={classNames("mr-8 last:mr-0", "text-grey1", "font-medium")}
        >
          <Link to={route.to || "/"}>{route.title}</Link>
        </Fonts>
      ))}
    </ul>
  </nav>
);
