import "dotenv/config";
import {serve} from "blueprint-server";
import session from "./session";

const options = {
    cors: {origin: process.env.CORS_ORIGIN}
};

serve({}, session, options);