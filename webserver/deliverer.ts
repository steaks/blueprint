import {BResponse} from "./webserver";
import blueprint, {Graph} from "blueprint";

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
  return blueprint.graph(
    "send",
    {},
    blueprint.operator.operator(beforeSend),
    blueprint.operator.tap(sendResponse)
  );
};

export default send;
