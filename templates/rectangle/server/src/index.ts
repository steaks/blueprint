import "dotenv/config";
import {serve} from "blueprint-server";
import session from "./session";
import myApp from "./apps/myApp";

const options = {
    cors: {origin: process.env.CORS_ORIGIN}
};

serve({myApp}, session, options);