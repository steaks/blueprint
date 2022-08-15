import webserver , {WithQuery}from "../../index";
import account from "./account";
import about from "./about";
import home from "./home";
import blueprint from "blueprint";

const _routes = webserver.router.routers([about, account, home])
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

const routes = blueprint.graph("routes", {}, _routes)

export default routes;
