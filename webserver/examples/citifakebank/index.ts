import webserver, {WithQuery} from "../../index";
import blueprint, {Graph} from "blueprint";
import account ,{getActivity,getBalance}from "./account";
import about from "./about";
import home from "./home";
import log from "./log";
import routes from "./routes";

const beforeRoutes = blueprint.graph(
  "beforeRoutes",
  blueprint.operator.tap(log.logRequest),
  "request"
);

const afterRoutes = blueprint.graph(
  "afterRoutes",
  blueprint.operator.tap(log.logResponse),
  "response"
);

const server = webserver.serve(beforeRoutes, routes, afterRoutes);

// Blueprint UI

const app = blueprint.serialize.sheet("app", [
  server,
  beforeRoutes,
  routes,
  home.routes,
  about.routes,
  account.routes,
  getActivity,
  getBalance,
  afterRoutes
], "Main infrastructure.");

const aboutSheet = blueprint.serialize.sheet("about", [
  about.routes,
], "Logic for displaying information about the bank's history and employees.");

const accountSheet = blueprint.serialize.sheet("account", [
  account.routes,
  getActivity,
  getBalance,
  afterRoutes
], "Logic for showing a user's account information - including balance, activity, etc.");

blueprint.serialize.build("CitiFakeBank", [app]);