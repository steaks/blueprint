import webserver, {BResponse, WithQuery} from "../../index";
import blueprint, {Graph} from "blueprint";
import authentication ,{WithUser}from "./authentication";

const logRequest = (p: WithQuery) => {
  console.log("Request:", p.url);
};

const beforeRoutes = blueprint.graph(
  "beforeRoutes",
  {},
  blueprint.operator.tap(logRequest)
) as unknown as Graph<WithQuery, WithQuery>;

const account = webserver.router.router<WithQuery, WithUser>("/account")
  .before(authentication.authenticate)
  .get("/profile", (p: WithUser) => ({...p, data: `User profile: ${p.user.username}`, statusCode: 200}))
  .get("/activity", (p: WithUser) => ({...p, data: `User history: ${p.user.username} hasn't done anything yet!`, statusCode: 200}))
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

const about = webserver.router.router<WithQuery, WithUser>("/about")
  .get("/team", (p: WithUser) => ({...p, data: "The team is just one dude...Steven.", statusCode: 200}))
  .get("/history", (p: WithUser) => ({...p, data: "The team formed in 2022!", statusCode: 200}))
  .notFound((p: WithUser) => ({...p, data: "NOT FOUND", statusCode: 404}));

const home = webserver.router.router("")
  .get("/", (p: WithQuery) => ({
    ...p,
    data: "<a href='/account/profile?token=stevenstoken'>account/profile</a><br/><a href='/account/activity?token=stevenstoken'>account/activity</a><br/><a href='/about/team'>about/team</a><br/><a href='/about/history'>about/history</a>",
    statusCode: 200
  }))
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

const _routes = webserver.router.routers([account, about, home])
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

const routesGraph = blueprint.graph("routes", {}, _routes);

const logResponse = (p: BResponse) => {
  console.log("Response:", p.data);
};

const beforeSend = blueprint.graph(
  "beforeSend",
  {},
  blueprint.operator.tap(logResponse)
) as unknown as Graph<BResponse, BResponse>;

const server = webserver.serve(beforeRoutes, routesGraph, beforeSend);

const application = blueprint.serialize.sheet("application", [server, beforeRoutes, routesGraph, account.routes, about.routes, home.routes, beforeSend]);
blueprint.serialize.build([application]);
