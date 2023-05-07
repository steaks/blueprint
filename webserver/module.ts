import blueprint from "blueprint";
import {Func1, Graph, Operator} from "blueprint/types";
import {BResponse, BRequest} from "./index";

export interface Module<A extends BRequest> {
  readonly path: string;
  readonly routes: Graph<A, BResponse>;
}

export const routes = <A extends BRequest, B extends A>(namespace: string) => {
  interface R {
    readonly check: (a0: B) => boolean;
    readonly func: Func1<B, BResponse>;
  }

  const input = blueprint.input<A>();
  let before = null as null | Operator<B>;
  const _routes = [] as R[];

  const api = {
    before: (func: Func1<A, B>) => {
      before = blueprint.operator(func, input);
      return api;
    },
    get: (path: string, func: Func1<B, BResponse>) => {
      _routes.push({
        check: (request: B) => request.req.method === "GET" && request.url.path !== null && request.url.path.startsWith(`${namespace}${path}`),
        func
      });
      return api;
    },
    post: (path: string, func: Func1<B, BResponse>) => {
      _routes.push({
        check: (request: B) => request.req.method === "POST" && request.url.path !== null && request.url.path.startsWith(`${namespace}${path}`),
        func
      });
      return api;
    },
    notFound: (func: Func1<B, BResponse>): Module<A> => {
      if (before) {
        let b = blueprint.branch<B, BResponse>("routes", before!)
        _routes.forEach(r => {
          b = b.case(r.check, r.func);
        });
        const operator = b.default(func)
        const graph = blueprint.graph("routes", input,  before!, operator);
        return {path: namespace, routes: graph};
      }
      let b = blueprint.branch<B, BResponse>("routes", input as Operator<B>)
      _routes.forEach(r => {
        b = b.case(r.check, r.func);
      });
      const operator = b.default(func)
      const graph = blueprint.graph("routes", input, operator);
      return {path: namespace, routes: graph};
    }
  };

  return api;
};

export const modules = <A extends BRequest>(r: Module<A>[]) => {
  const input = blueprint.input<A>();
  let b = blueprint.branch<A, BResponse>("modules", input)
  r.forEach(rr => {
    b = b.case(request => request.url.path !== null && request.url.path.startsWith(rr.path), rr.routes)
  });
  return {
    notFound: (func: Func1<A, BResponse>) =>
      blueprint.graph("Modeules", input, b.default(func))
  };
};

export default {
  routes,
  modules
};
