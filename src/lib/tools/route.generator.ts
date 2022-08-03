import React, { ComponentProps } from "react";
import { generatePath, Route, RouteComponentProps } from "react-router-dom";

export interface ClassRouteProps
  extends Pick<ComponentProps<typeof Route>, "path" | "exact"> {
  path: string;
  title: string;
  routes?: ClassRouteProps[];
  render: React.FC<any>;
  summaryKey?: string;
  to?: string;
}

export interface RouteWithSubRoutesRenderProps
  extends RouteComponentProps,
    ClassRouteProps {
  routes?: ClassRouteProps[];
}

export type Routes = ClassRouteProps[];

export class RouteGenerator<P extends Record<string, any>> {
  constructor(private routePath: string) {}

  getRoute() {
    return this.routePath;
  }

  getLinks(...arg: P extends Record<string, any> ? [P] : [undefined?]) {
    const paramsProps = arg[0];

    return generatePath(this.routePath, paramsProps);
  }
}
