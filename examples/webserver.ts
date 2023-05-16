import blueprint from "blueprint-core";

interface Req {
  readonly method: string;
  readonly path: string;
}

const headersParser = (request: Req) => console.log("PARSE HEADERS");
const queryStringParser = (request: Req) => console.log("PARSE QUERY STRING");
const bodyParser = (request: Req) => console.log("PARSE BODY");
const cookieParser = (request: Req) => console.log("PARSE COOKIES");
const logger = (request: Req) => console.log("LOG");
const authentication = (request: Req) => console.log("AUTHENTICATION");
const compress = () => console.log("COMPRESS")

const before = (() => {
  const input = blueprint.input<Req>()
  const headersParserO = blueprint.operator(headersParser, input);
  const queryStringParserO = blueprint.operator(queryStringParser, input);
  const bodyParserO = blueprint.operator(bodyParser, input);
  const cookieParserO = blueprint.operator(cookieParser, input);
  const loggerO = blueprint.operator(logger, input);
  const authenticationO = blueprint.operator(authentication, input);
  return blueprint.graph("before", input, headersParserO, queryStringParserO, bodyParserO, cookieParserO, loggerO, authenticationO);
})();

const after = (() => {
  const input = blueprint.input<void>();
  const compressO = blueprint.operator(compress);
  return blueprint.graph("after", input, compressO);

})();

const get = (request: Req) => request.method === "GET";
const post = (request: Req) => request.method === "POST";
const foo = (request: Req) => request.path === "/foo";
const bar = (request: Req) => request.path === "/foo";
const baz = (request: Req) => request.path === "/foo";

const doFoo = (request: Req) => console.log("DO FOO");
const doBar = (request: Req) => console.log("DO BAR");
const doBaz = (request: Req) => console.log("DO BAZ");
const notFound = (request: Req) => console.log("404");

const gets = (() => {
  const input = blueprint.input<Req>();
  const getRoutes = blueprint
    .branch("routes", input)
    .case(foo, doFoo)
    .case(bar, doBar)
    .case(baz, doBaz)
    .default(notFound);
  return blueprint.graph("gets", input, getRoutes)
})();


const posts = (() => {
  const input = blueprint.input<Req>();
  const postRoutes = blueprint
    .branch("routes", input)
    .case(foo, doFoo)
    .case(bar, doBar)
    .case(baz, doBaz)
    .default(notFound);
  return blueprint.graph("gets", input, postRoutes)
})();

const routes = (() => {
  const input = blueprint.input<Req>();
  return blueprint
    .branch("methods", input)
    .case(get, gets)
    .case(post, posts)
    .default(notFound);
})();

const app = (() => {
  const input = blueprint.input<Req>();
  return blueprint.graph(
    "webserver",
    input,
    blueprint.operator(before, input),
    routes,
    blueprint.operator(after)
  );
})();

const webserver = blueprint.serialize.sheet("webserver", [app]);

export default webserver;
