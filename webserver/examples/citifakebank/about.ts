import webserver, {WithQuery}from "../../index";

const about = webserver.router.router("/about")
  .get("/team", (request: WithQuery) => ({...request, data: "<div><h1>Employees</h1><ul><li>Steven</li><li>Becky</li></ul></div>", statusCode: 200}))
  .get("/history", (p: WithQuery) => ({...p, data: "The bank was formed in 2023!", statusCode: 200}))
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

export default about;
