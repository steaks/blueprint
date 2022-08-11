import webserver, {BResponse, WithQuery} from "../../index";
import blueprint, {Graph} from "blueprint";

const beforeRoutes = blueprint.graph1(
  "beforeRoutes",
  {},
  blueprint.operator.operator((p: WithQuery) => p).bname("session")
) as unknown as Graph<WithQuery, WithQuery>;

const v1 = webserver.router.router("/v1")
  .get("/foo", (p: WithQuery) => ({...p, data: "Woohoo! This is the response for /v1/foo!", statusCode: 200}))
  .get("/bar", (p: WithQuery) => ({...p, data: "Woohoo! This is the response for /v1/bar!", statusCode: 200}))
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

const v2 = webserver.router.router("/v2")
  .get("/foo", (p: WithQuery) => ({...p, data: "Woohoo! This is the response for /v2/foo!", statusCode: 200}))
  .get("/bar", (p: WithQuery) => ({...p, data: "Woohoo! This is the response for /v2/bar!", statusCode: 200}))
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

const home = webserver.router.router("")
  .get("/", (p: WithQuery) => ({
    ...p,
    data: "<a href='/v1/foo'>v1/foo</a><br/><a href='/v1/bar'>v1/bar</a><br/><a href='/v2/foo'>v2/foo</a><br/><a href='/v2/bar'>v2/bar</a>",
    statusCode: 200
  }))
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

const _routes = webserver.router.routers([v1, v2, home])
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

const routesGraph = blueprint.graph1("routes", {}, _routes);

const logResponse = (p: BResponse) => {
  console.log("Response:", p.data);
};

const beforeSend = blueprint.graph1(
  "beforeSend",
  {},
  blueprint.operator.tap(logResponse)
) as unknown as Graph<BResponse, BResponse>;

const [, server] = webserver.serve(beforeRoutes, routesGraph, beforeSend);

const routes = blueprint.serialize.sheet("routes", [routesGraph, v1.routes, v2.routes, home.routes]);
blueprint.serialize.build([server, routes]);
