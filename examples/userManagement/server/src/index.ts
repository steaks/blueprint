import "dotenv/config";
import {create} from "blueprint-server";
import session from "./session";
import dashboard from "./apps/dashboard";
import {ServerOptions} from "blueprint-server/types/types";

const options = {
  cors: {origin: process.env.CORS_ORIGIN || "http://localhost:3000"},
  connectionType: "WebSocket"
} as Partial<ServerOptions>;

const bp = create({dashboard}, session, options);
bp.serve();