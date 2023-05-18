import {BRequest, BResponse} from "./webserver";
import blueprint from "blueprint-core";
import {Graph} from "blueprint-core/types";

const sendResponse = (p: BResponse) => {
  p.res.statusCode = p.statusCode;
  if (p.headers) {
    for (const name in p.headers) {
      const value = p.headers[name]!;
      p.res.setHeader(name, value);
    }
  } else {
    switch (typeof p.data) {
      case "string":
        p.res.setHeader("Content-Type", "html");
        break;
      case "boolean":
      case "number":
      case "object":
        p.res.setHeader("Content-Type", "application/json");
        break;
    }
  }

  let data;
  switch (typeof p.data) {
    case "string":
      data = p.data;
      break;
    case "boolean":
    case "number":
    case "object":
      data = JSON.stringify(p.data);
      break;
  }

  p.res.write(data);
  p.res.end();
};

const send = (beforeSend: Graph<BResponse, BResponse>): Graph<BResponse, any> => {
  const input = blueprint.input<BResponse>();
  return blueprint.graph(
    "send",
    input,
    blueprint.operator(beforeSend, input),
    blueprint.operator(sendResponse, input),
  );
};

export default send;
