import webserver, {BRequest, BResponse} from "../../../index";
import {notFound} from "./common";

const team = (request: BRequest): BResponse =>
    ({...request, data: "<div><h1>Employees</h1><ul><li>Steven</li><li>Becky</li></ul></div>", statusCode: 200});

const history = (request: BRequest): BResponse =>
    ({...request, data: "The bank was formed in 2023!", statusCode: 200});

const about = webserver.routes("/about")
  .get("/team", team)
  .get("/history", history)
  .notFound(notFound);

export default about;
