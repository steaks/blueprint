import {BResponse, WithQuery} from "../../webserver";

const logRequest = (p: WithQuery) => {
  console.log("Request:", p.url);
};

const logResponse = (p: BResponse) => {
  console.log("Response:", p.data);
};

export default {
  logRequest,
  logResponse
};
