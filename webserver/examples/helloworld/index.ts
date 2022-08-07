import webserver, {BResponse, WithQuery} from "../../index";
import blueprint, {Graph} from "blueprint";

const before = blueprint.graph1(
  "before",
  {},
  blueprint.operator.operator((p: WithQuery) => p).bname("session")
) as unknown as Graph<WithQuery, WithQuery>;

const v1 = webserver.router.router("/v1")
  .get("/foo", (p: WithQuery) => send({...p, data: "Woohoo! This is the response for /v1/foo!", statusCode: 200}))
  .notFound((p: WithQuery) => send({...p, data: "NOT FOUND", statusCode: 404}));

const v2 = webserver.router.router("/v2")
  .get("/foo", (p: WithQuery) => send({...p, data: "Woohoo! This is the response for /v2/foo!", statusCode: 200}))
  .notFound((p: WithQuery) => send({...p, data: "NOT FOUND", statusCode: 404}));

const home = webserver.router.router("")
  .get("/", (p: WithQuery) => send({
    ...p,
    data: "<a href='/v1/foo'>v1/foo</a><br/><a href='/v2/foo'>v2/foo</a>",
    statusCode: 200
  }))
  .notFound((p: WithQuery) => send({...p, data: "NOT FOUND", statusCode: 404}));

const _routes = webserver.router.routers([v1, v2, home])
  .notFound((p: WithQuery) => send({...p, data: "NOT FOUND", statusCode: 404}));

const routesGraph = blueprint.graph1("routes", {}, _routes);

const logResponse = (p: BResponse) => console.log("HERE");

const onResponse = blueprint.graph1(
  "onResponse",
  {},
  blueprint.operator.tap(logResponse)
) as unknown as Graph<BResponse, BResponse>;

const receive = webserver.receiver(before, routesGraph)
const send = webserver.deliverer(onResponse)

const infrastructure = blueprint.serialize.sheet("infrastructure", [receive, before, send, onResponse]);
const routes = blueprint.serialize.sheet("routes", [routesGraph, v1.routes, v2.routes]);
blueprint.serialize.build([infrastructure, routes]);
