import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import {Url} from "url";
import blueprint, {Graph} from "blueprint";
import * as qs from "qs";
import {ParsedQs} from "qs";
// @ts-ignore
import parseurl from "parseurl";

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

const listen = (receive: Graph<Params, any>) => {
  const server = http.createServer((req, res: ServerResponse) => {
    receive({req, res});
  });

  console.log("Server listening on port 3000");
  server.listen(3000);
};

const receiver = <A>(before: Graph<WithQuery, A>, routes: Graph<A, any>): Graph<Params, any> => {
  const _receive = blueprint.graph4("webserver",
    {},
    blueprint.operator.operator(parseUrl),
    blueprint.operator.operator(parseQuery),
    blueprint.operator.operator(before),
    blueprint.operator.operator(routes),
  );
  listen(_receive);
  return _receive;
};

export default receiver;
