import "dotenv/config";
import {create} from "blueprint-server";
import userProfile from "./apps/userProfile";
import session from "./session";

const options = {
  cors: {origin: process.env.CORS_ORIGIN}
};

const bp = create({userProfile}, session);
bp.serve(options);