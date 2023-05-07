import blueprint from "blueprint";
import one from "./one";
import two from "./two";
import branch from "./branch";
import webserver from "./webserver";

blueprint.serialize.build("Examples", [one, two, branch, webserver]);