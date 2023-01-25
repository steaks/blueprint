import blueprint from "blueprint";
import {sheet as routesSheet} from "./routes";
import {sheet as serverSheet} from "./server";
import {sheet as middlewareSheet} from "./middleware";
import {sheet as accountSheet} from "./account";
import {sheet as logSheet} from "./log";

blueprint.serialize.build("CitiFakeBank", [serverSheet, middlewareSheet, routesSheet, accountSheet, logSheet]);