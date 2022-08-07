import blueprint from "blueprint";
import one from "./one";
import two from "./two";
import branch from "./branch";
import eslint from "./eslint";
import webserver from "./webserver";

blueprint.serialize.build([one, two, branch, eslint, webserver]);
