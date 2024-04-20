import "dotenv/config";
import {create} from "blueprint-server";
import session from "./session";
import team from "./apps/team";
import {ServerOptions} from "blueprint-server/types/types";

const options = {
  cors: {origin: process.env.CORS_ORIGIN || "http://localhost:3000"},
  connectionType: "WebSocket"
} as Partial<ServerOptions>;

const bp = create({team}, session, options);
bp.serve();