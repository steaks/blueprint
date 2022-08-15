import * as http from "http";
import {IncomingMessage,OutgoingHttpHeaders, ServerResponse} from "http";
import {Url} from "url";
import blueprint, {Graph,SheetJSON} from "blueprint";
import * as qs from "qs";
import {ParsedQs} from "qs";
// @ts-ignore
import parseurl from "parseurl";
import send from "./send";

const parseUrl = (p: Params): WithUrl => {
  const url = parseurl(p.req) as Url;
  return {...p, url};
};

const parseQuery = (p: WithUrl): WithQuery => {
  const query = qs.parse(p.url.query as string);
  return {...p, query};
};

export interface Params {
  readonly req: IncomingMessage;
  readonly res: ServerResponse;
}

export type WithUrl = Params & {
  readonly url: Url;
};

export type WithQuery = WithUrl & {
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

const serve = <A>(before: Graph<WithQuery, A>, routes: Graph<A, BResponse>, beforeSend: Graph<BResponse, BResponse>): Graph<Params, any> => {
  const server = blueprint.graph("server",
    {},
    blueprint.operator.operator(parseUrl),
    blueprint.operator.operator(parseQuery),
    blueprint.operator.operator(before),
    blueprint.operator.operator(routes),
    blueprint.operator.operator(beforeSend),
    blueprint.operator.tap(send)
  );
  listen(server);

  return server;
};



export default serve;
