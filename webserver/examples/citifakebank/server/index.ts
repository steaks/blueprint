import blueprint from "blueprint";
import {afterRoutes, beforeRoutes} from "../middleware";
import {routes} from "../routes";
import webserver from "../../../index";

const server = webserver.serve(beforeRoutes, routes, afterRoutes);

// Blueprint UI
export const sheet = blueprint.serialize.sheet("Server", [server], "Server");