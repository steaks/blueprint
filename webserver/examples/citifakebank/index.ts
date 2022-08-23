import webserver, {BResponse, WithQuery} from "../../index";
import blueprint, {Graph} from "blueprint";
import account ,{getActivity,getBalance}from "./account";
import about from "./about";
import home from "./home";
import log from "./log";
import routes from "./routes";

const beforeRoutes = blueprint.graph(
  "beforeRoutes",
  blueprint.operator.tap(log.logRequest)
) as unknown as Graph<WithQuery, WithQuery>;

const afterRoutes = blueprint.graph(
  "afterRoutes",
  blueprint.operator.tap(log.logResponse)
) as unknown as Graph<BResponse, BResponse>;

const server = webserver.serve(beforeRoutes, routes, afterRoutes);

const application = blueprint.serialize.sheet("application", [
  server,
  beforeRoutes,
  routes,
  home.routes,
  afterRoutes
], "Main infrastructure.");
const aboutSheet = blueprint.serialize.sheet("about", [
  about.routes,
], "About the bank.");
const accountSheet = blueprint.serialize.sheet("account", [
  account.routes,
  getActivity,
  getBalance,
  afterRoutes
], "Account management");
blueprint.serialize.build("CitiFakeBank", [application, aboutSheet, accountSheet]);
