import webserver, {WithQuery}from "../../index";
import {WithUser} from "./authentication";

const about = webserver.router.router<WithQuery, WithUser>("/about")
  .get("/team", (p: WithUser) => ({...p, data: "The bank only has one employee...Steven.", statusCode: 200}))
  .get("/history", (p: WithUser) => ({...p, data: "The bank was formed in 2023!", statusCode: 200}))
  .notFound((p: WithUser) => ({...p, data: "NOT FOUND", statusCode: 404}));

export default about;
