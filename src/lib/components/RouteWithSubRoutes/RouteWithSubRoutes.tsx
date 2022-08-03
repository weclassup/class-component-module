import React from "react";
import { Route } from "react-router-dom";
import { ClassRouteProps } from "../../tools/route.generator";

export const RouteWithSubRoutes: React.FC<ClassRouteProps> = (route) => {
  if (!route.routes)
    return (
      <Route
        path={route.path}
        render={(props) => <route.render {...props} {...route} />}
      />
    );

  return (
    <Route
      {...route}
      render={(props) => {
        return <>{<route.render {...props} {...route} />}</>;
      }}
    />
  );
};

export default RouteWithSubRoutes;
