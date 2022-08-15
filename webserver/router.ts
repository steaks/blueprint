import blueprint, {AsyncOperator, AsyncParams, Branch, Graph} from "blueprint";
import {WithQuery} from "./index"; import {WithUser} from "./examples/helloworld/authentication";

export interface Router<A extends WithQuery> {
  readonly path: string;
  readonly routes: Graph<A, any>;
}

export const router = <A extends WithQuery, B extends A>(namespace: string) => {
  let logic: null | Branch<B, any, any, any> = null;
  let before = [] as AsyncOperator<A,any,any,any>[];

  const api = {
    before: (func: AsyncParams<A, B, any, any>) => {
      before.push(blueprint.operator.operator(func));
      return api;
    },
    get: (path: string, func: AsyncParams<B, any, any, any>) => {
      if (!logic) {
        logic = blueprint.operator.if(
          (r: B) => r.req.method === "GET" && r.url.path !== null && r.url.path.startsWith(`${namespace}${path}`),
          blueprint.operator.operator(func).bname(path)
        );
      } else {
        logic = logic.elseif(
          (r: B) => r.req.method === "GET" && r.url.path !== null && r.url.path.startsWith(`${namespace}${path}`),
          blueprint.operator.operator(func).bname(path)
        );
      }
      return api;
    },
    post: (path: string, func: AsyncParams<B, any, any, any>) => {
      if (!logic) {
        logic = blueprint.operator.if(
          (r: B) => r.req.method === "POST" && r.url.path !== null && r.url.path.startsWith(`${namespace}${path}`),
          blueprint.operator.operator(func).bname(path)
        );
      } else {
        logic = logic.elseif(
          (r: B) => r.req.method === "POST" && r.url.path !== null && r.url.path.startsWith(`${namespace}${path}`),
          blueprint.operator.operator(func).bname(path)
        );
      }
      return api;
    },
    notFound: (p: AsyncParams<B, any, any, any>): Router<A> => {
      const op = logic!.else(blueprint.operator.operator(p).bname("404")).end("routes");
      const routes = before.length > 0
        ? blueprint.graph(namespace || "*", {}, before[0], op)
        : blueprint.graph(namespace || "*", {}, op) as Graph<A, any>;
      return {path: namespace, routes};
    }
  };

  return api;
};

export const routers = <A extends WithQuery>(r: Router<A>[]) => {
  let logic = blueprint.operator.if((p: WithQuery) => p.url.path !== null && p.url.path.startsWith(r[0].path), r[0].routes);
  logic = r.slice(1).reduce((logic, rr) =>
    logic.elseif((p: WithQuery) => p.url.path !== null && p.url.path.startsWith(rr.path), rr.routes),
    logic
  );
  return {
    notFound: (p: AsyncParams<A, any, any, any>): AsyncOperator<A, any, any, any> =>
      logic.else(blueprint.operator.operator(p).bname("404")).end("routers")
  }
};

export default {
  router,
  routers
};
