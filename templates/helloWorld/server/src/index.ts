import "dotenv/config";
import {serve} from "blueprint-server";
import helloWorld from "./apps/helloWorld";
import session from "./session";

const options = {
    cors: {origin: process.env.CORS_ORIGIN}
};

serve({helloWorld}, session, options);