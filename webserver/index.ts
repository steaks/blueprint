import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import {Url} from "url";
import blueprint, {AsyncOperator, AsyncParams, Graph, SheetJSON} from "blueprint";
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

interface Params {
  readonly req: IncomingMessage;
  readonly res: ServerResponse;
}

export type WithUrl = Params & {
  readonly url: Url;
};

export type WithQuery = WithUrl & {
  readonly query: ParsedQs;
};

const get = (path: string) => (p: WithQuery): boolean =>
  p.url.pathname === path;

const post = (path: string) => (p: WithQuery): boolean =>
  p.url.pathname === path;

const all = (path: string) => (p: WithQuery): boolean =>
  p.url.pathname === path;

const sub = (path: string) => (p: WithQuery): boolean =>
  p.url.pathname === path;

const receive = <A>(before: Graph<WithQuery, A>, routes: Graph<A, any>): Graph<Params, any> => {
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

export type BResponse = Params & {
  readonly statusCode: number;
  readonly data: any;
}

const sendMessage = (p: BResponse) => {
  p.res.statusCode = p.statusCode;
  p.res.write(p.data);
  p.res.end();
};

const send = (before: Graph<BResponse, BResponse>): Graph<BResponse, any> => {
  return blueprint.graph2(
    "send",
    {},
    blueprint.operator.operator(before),
    blueprint.operator.tap(sendMessage)
  );
};

const listen = (receive: Graph<Params, any>) => {
  const server = http.createServer((req, res: ServerResponse) => {
    receive({req, res});
  });

  server.listen(3000);
};

export default {
  receive,
  send,
  get,
  post,
  all
};
