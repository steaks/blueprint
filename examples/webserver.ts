import blueprint, {Graph} from "blueprint";

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

const before = blueprint.graph6(
  "before",
  {},
  blueprint.operator.tap(headersParser),
  blueprint.operator.tap(queryStringParser),
  blueprint.operator.tap(bodyParser),
  blueprint.operator.tap(cookieParser),
  blueprint.operator.tap(logger),
  blueprint.operator.tap(authentication)
);

const after = blueprint.graph1(
  "after",
  {},
  blueprint.operator.tap(compress)
);

const get = (request: Req) => request.method === "GET";
const post = (request: Req) => request.method === "POST";
const foo = (request: Req) => request.path === "/foo";
const bar = (request: Req) => request.path === "/foo";
const baz = (request: Req) => request.path === "/foo";

const doFoo = (request: Req) => console.log("DO FOO");
const doBar = (request: Req) => console.log("DO BAR");
const doBaz = (request: Req) => console.log("DO BAZ");
const notFound = blueprint.operator.tap((request: Req) => console.log("404")).bname("404");

const getRoutes = blueprint.operator
  .if(foo, blueprint.operator.tap(doFoo).bname("/foo"))
  .elseif(bar, blueprint.operator.tap(doBar).bname("/bar"))
  .elseif(baz, blueprint.operator.tap(doBaz).bname("/baz"))
  .else(notFound)
  .end("routes");

const gets = blueprint.graph1("gets", {}, getRoutes);

const postRoutes = blueprint.operator
  .if(foo, blueprint.operator.tap(doFoo).bname("/foo"))
  .elseif(bar, blueprint.operator.tap(doBar).bname("/bar"))
  .elseif(baz, blueprint.operator.tap(doBaz).bname("/baz"))
  .else(notFound)
  .end("routes");

const posts = blueprint.graph1("posts", {}, postRoutes);

const routes = blueprint.operator
  .if(get, gets)
  .elseif(post, posts)
  .else(notFound)
  .end("methods");

const app = blueprint.graph3(
  "webserver",
  {},
  blueprint.operator.tap(before).bname("before"),
  routes,
  blueprint.operator.tap(after).bname("after")
);

const webserver = blueprint.serialize.sheet("webserver", [app, before, after, gets, posts]);

export default webserver;
