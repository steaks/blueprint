import blueprint, {Graph} from "blueprint";

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

const lintTextG: Graph<string, string> = blueprint.graph1("lintText", {}, blueprint.operator.operator(lintText));
const lintFilesG: Graph<string, string> = blueprint.graph1("lintFiles", {}, blueprint.operator.operator(lintFiles));

const eslint = blueprint.graph5(
  "eslint",
  {},
  blueprint.operator.operator(parseOptions),
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
  blueprint.operator.operator(fix),
  blueprint.operator.operator(handleErrors)
)



const mySheet = blueprint.serialize.sheet("eslint", [
  eslint
]);

export default mySheet;
