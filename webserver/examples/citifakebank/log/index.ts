import blueprint from "blueprint";
import {BResponse, WithQuery} from "../../../webserver";

const _logRequest = (request: WithQuery) => {
  console.log("Request:", request.url);
};

const _logResponse = (request: BResponse) => {
  console.log("Response:", request.data);
};

export const logRequest = blueprint.graph("logRequest", blueprint.operator.tap(_logRequest), "");
export const logResponse = blueprint.graph("logResponse", blueprint.operator.tap(_logResponse), "");

export const sheet = blueprint.serialize.sheet("Log", [
  logRequest,
  logResponse,
]);