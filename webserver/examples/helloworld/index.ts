import webserver, {BResponse, WithQuery} from "../../index";
import blueprint, {AsyncOperator, AsyncParams, Graph, Branch} from "blueprint";

const before = blueprint.graph1(
  "before",
  {},
  blueprint.operator.operator((p: WithQuery) => p).bname("session")
) as unknown as Graph<WithQuery, WithQuery>;

interface Router {
  readonly path: string;
  readonly routes: Graph<WithQuery, any>;
}

const router = <A>(namespace: string) => {
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

const routers = (r: Router[]) => {
  let logic = blueprint.operator.if((p: WithQuery) => p.url.path !== null && p.url.path.startsWith(r[0].path), r[0].routes);
  logic = r.slice(1).reduce((logic, rr) => {
    return logic.elseif((p: WithQuery) => p.url.path !== null && p.url.path.startsWith(rr.path), rr.routes);
  }, logic);
  return {
    notFound: (p: AsyncParams<WithQuery, any, any, any>): AsyncOperator<WithQuery, any, any, any> =>
      logic.else(blueprint.operator.operator(p).bname("404")).end("routers")
  }
};

const v1 = router("/v1")
  .get("/foo", (p: WithQuery) => send({...p, data: "GET /v1/foo", statusCode: 200}))
  .post("/foo", (p: WithQuery) => send({...p, data: "POST /v1/foo", statusCode: 200}))
  .notFound((p: WithQuery) => send({...p, data: "NOT FOUND", statusCode: 404}));

const v2 = router("/v2")
  .get("/foo", (p: WithQuery) => send({...p, data: "GET /v2/foo", statusCode: 200}))
  .post("/foo", (p: WithQuery) => send({...p, data: "POST /v2/foo", statusCode: 200}))
  .notFound((p: WithQuery) => send({...p, data: "NOT FOUND", statusCode: 404}));

const home = router("")
  .get("/", (p: WithQuery) => send({
    ...p,
    data: JSON.stringify(["GET /v1/foo", "POST /v1/foo", "GET /v2/foo", "POST /v2/foo"]),
    statusCode: 200
  }))
  .notFound((p: WithQuery) => send({...p, data: "NOT FOUND", statusCode: 404}));

const _routes = routers([home, v1, v2])
  .notFound((p: WithQuery) => send({...p, data: "NOT FOUND", statusCode: 404}));

const routesGraph = blueprint.graph1("routes", {}, _routes);

const logResponse = (p: BResponse) => console.log("HERE");

const onResponse = blueprint.graph1(
  "onResponse",
  {},
  blueprint.operator.tap(logResponse)
) as unknown as Graph<BResponse, BResponse>;

const receive = webserver.receive(before, routesGraph)
const send = webserver.send(onResponse)

const infrastructure = blueprint.serialize.sheet("infrastructure", [receive, before, send, onResponse]);
const routes = blueprint.serialize.sheet("routes", [routesGraph, v1.routes, v2.routes]);
blueprint.serialize.build([infrastructure, routes]);
