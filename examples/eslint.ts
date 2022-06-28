import blueprint from "../blueprint";
import {Graph} from "../blueprint/src/core";

const parseOptions = (a: string) => {
  return "parseOptions";
};

const help = (a: string) => {
  return "help";
};

const version = (a: string) => {
  return "help";
};

const envInfo = (a: string) => {
  return "help";
};

const printConfig = (a: string) => {
  return "help";
};

const noop = (a: string) => {
  return "help";
};

const handleErrors = (a: string) => {
  return "help";
};

const lintText = (a: string) => {
  return "help";
};

const lintFiles = (a: string) => {
  return "help";
};

const fix = (a: string) => {
  return "help";
};

const handleResults = (a: string) => {
  return "help";
};

const lintTextG: Graph<string, string> = blueprint.graph1("lintText", {}, blueprint.operator.async(lintText));
const lintFilesG: Graph<string, string> = blueprint.graph1("lintFiles", {}, blueprint.operator.async(lintFiles));

const eslint = blueprint.graph5(
  "eslint",
  {},
  blueprint.operator.async(parseOptions),
  blueprint.operator
    .if(() => true, help)
    .elseif(() => true, version)
    .elseif(() => true, envInfo)
    .elseif(() => true, printConfig)
    .else(noop)
    .end("checkOption"),
  blueprint.operator
    .if(() => true, lintTextG)
    .else(lintFilesG)
    .end("textOrFiles"),
  blueprint.operator.async(fix),
  blueprint.operator.async(handleErrors)
)



const mySheet = blueprint.serialize.sheet("eslint", [
  eslint
]);

export default mySheet;