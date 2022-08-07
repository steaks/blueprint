import {Params} from "./receiver";
import blueprint, {Graph} from "blueprint";
import {OutgoingHttpHeaders} from "http";

export type BResponse = Params & {
  readonly statusCode: number;
  readonly headers?: OutgoingHttpHeaders;
  readonly data: any;
}

const deliver = (p: BResponse) => {
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

const deliverer = (before: Graph<BResponse, BResponse>): Graph<BResponse, any> => {
  return blueprint.graph2(
    "send",
    {},
    blueprint.operator.operator(before),
    blueprint.operator.tap(deliver)
  );
};

export default deliverer;
