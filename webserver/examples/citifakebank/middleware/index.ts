import blueprint from "blueprint";
import {logRequest, logResponse} from "../log";
import authentication from "./authentication";

export const beforeRoutes = blueprint.graph(
  "beforeRoutes",
  blueprint.operator.tap(logRequest),
  "request"
);

export const afterRoutes = blueprint.graph(
  "afterRoutes",
  blueprint.operator.tap(logResponse),
  "response"
);

export const sheet = blueprint.serialize.sheet("Middleware", [
  beforeRoutes,
  afterRoutes
], "Middleware");