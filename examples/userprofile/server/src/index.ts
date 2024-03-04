import "dotenv/config";
import {create} from "blueprint-server";
import userProfile from "./apps/userProfile";
import session from "./session";

const options = {
  cors: {origin: process.env.CORS_ORIGIN || "http://localhost:3000"},
};

const bp = create({userProfile}, session, options);
bp.serve();