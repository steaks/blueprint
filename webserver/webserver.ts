import * as http from "http";
import {IncomingMessage,OutgoingHttpHeaders, ServerResponse} from "http";
import {Url} from "url";
import blueprint from "blueprint";
import * as qs from "qs";
import {ParsedQs} from "qs";
// @ts-ignore
import parseurl from "parseurl";
import send from "./send";
import {Module} from "./module";
import webserver from "./index";
import { Graph } from "blueprint/types";

const parseUrl = (request: Params): WithUrl => {
  const url = parseurl(request.req) as Url;
  return {...request, url};
};

const parseQuery = (p: WithUrl): BRequest => {
  const query = qs.parse(p.url.query as string);
  return {...p, query};
};

export interface Params {
  readonly req: IncomingMessage;
  readonly res: ServerResponse;
}

type WithUrl = Params & {
  readonly url: Url;
};


export type BRequest = WithUrl & {
  readonly query: ParsedQs;
};


export type BResponse = Params & {
  readonly statusCode: number;
  readonly headers?: OutgoingHttpHeaders;
  readonly data: any;
}

const listen = (receive: Graph<Params, any>) => {
  const server = http.createServer((req, res: ServerResponse) => {
    receive({req, res});
  });

  console.log("Server listening on port 3000");
  server.listen(3000);
};

const cleanModuleName = (name: string) => {
  if (name === "") {
    return "home";
  }
  if (name.startsWith("/")) {
    return name.substring(1);
  }
};

const serve = (modules: Module<BRequest>[]): Graph<Params, any> => {
  const routes = webserver.modules(modules).notFound((r: BRequest) => ({...r, data: "foo", statusCode: 404}));
  const sheets = modules.map(r => blueprint.serialize.sheet(`${cleanModuleName(r.path)}`, [r.routes]))

  const input = blueprint.input<Params>();
  const urlO = blueprint.operator(parseUrl, input);
  const queryO = blueprint.operator(parseQuery, urlO);
  const routesO = blueprint.operator(routes, queryO);
  const sendO = blueprint.operator(send, routesO)

  const server = blueprint.graph("server",
    input,
    urlO,
    queryO,
    routesO,
    sendO,
  );
  blueprint.serialize.build("App", sheets);
  listen(server);

  return server;
};



export default serve;
