import "dotenv/config";
import {create} from "blueprint-server";
import {ServerOptions} from "blueprint-server/types";
import session from "./session";
import myApp from "./apps/myApp";

const options = {
  cors: {origin: process.env.CORS_ORIGIN || "http://localhost:3000"},
  connectionType: "WebSocket"
} as Partial<ServerOptions>;

const bp = create({myApp}, session, options);
bp.serve();
