import {BResponse, WithQuery} from "../../webserver";

const logRequest = (request: WithQuery) => {
  console.log("Request:", request.url);
};

const logResponse = (request: BResponse) => {
  console.log("Response:", request.data);
};

export default {
  logRequest,
  logResponse
};
