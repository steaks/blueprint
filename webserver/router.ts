import blueprint, {AsyncOperator, AsyncParams, Branch, Graph} from "blueprint";
import {WithQuery} from "./index";

export interface Router {
  readonly path: string;
  readonly routes: Graph<WithQuery, any>;
}

export const router = <A>(namespace: string) => {
  let logic: null | Branch<WithQuery, any, any, any> = null;

  const api = {
    get: (path: string, func: AsyncParams<WithQuery, any, any, any>) => {
      if (!logic) {
        logic = blueprint.operator.if(
          (r: WithQuery) => r.req.method === "GET" && r.url.path !== null && r.url.path.startsWith(`${namespace}${path}`),
          blueprint.operator.operator(func).bname(path)
        );
      } else {
        logic = logic.elseif(
          (r: WithQuery) => r.req.method === "GET" && r.url.path !== null && r.url.path.startsWith(`${namespace}${path}`),
          blueprint.operator.operator(func).bname(path)
        );
      }
      return api;
    },
    post: (path: string, func: AsyncParams<WithQuery, any, any, any>) => {
      if (!logic) {
        logic = blueprint.operator.if(
          (r: WithQuery) => r.req.method === "POST" && r.url.path !== null && r.url.path.startsWith(`${namespace}${path}`),
          blueprint.operator.operator(func).bname(path)
        );
      } else {
        logic = logic.elseif(
          (r: WithQuery) => r.req.method === "POST" && r.url.path !== null && r.url.path.startsWith(`${namespace}${path}`),
          blueprint.operator.operator(func).bname(path)
        );
      }
      return api;
    },
    notFound: (p: AsyncParams<WithQuery, any, any, any>): Router => {
      const op = logic!.else(blueprint.operator.operator(p).bname("404")).end("routes");
      const routes = blueprint.graph1(namespace, {}, op);
      return {path: namespace, routes};
    }
  };

  return api;
};

export const routers = (r: Router[]) => {
  let logic = blueprint.operator.if((p: WithQuery) => p.url.path !== null && p.url.path.startsWith(r[0].path), r[0].routes);
  logic = r.slice(1).reduce((logic, rr) =>
    logic.elseif((p: WithQuery) => p.url.path !== null && p.url.path.startsWith(rr.path), rr.routes),
    logic
  );
  return {
    notFound: (p: AsyncParams<WithQuery, any, any, any>): AsyncOperator<WithQuery, any, any, any> =>
      logic.else(blueprint.operator.operator(p).bname("404")).end("routers")
  }
};

export default {
  router,
  routers
};
