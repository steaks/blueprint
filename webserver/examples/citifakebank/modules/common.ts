import {BRequest} from "../../../webserver";
import {BResponse} from "../../../send";

export const notFound = (request: BRequest): BResponse =>
    ({...request, data: "NOT FOUND", statusCode: 404});
