import blueprint from "blueprint"; import webserver ,{WithQuery}from "../../index";

const before = blueprint.graph("before", blueprint.operator.tap(() => console.log("HELLO WORLD")));
const after = blueprint.graph("after", blueprint.operator.tap(() => console.log("HELLO WORLD")));
const routes = webserver.router.router("myrouter")
  .get("/foo", (p: WithQuery) => ({...p, statusCode: 200, data2: "FOO BAR"}))
  .notFound((p: WithQuery) => ({...p, statusCode: 200, data2: "FOO BAR"}));
