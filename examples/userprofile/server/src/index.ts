import "dotenv/config";
import {serve} from "@blueprint/server";
import userProfile from "./apps/userProfile";
import session from "./session";

const options = {
    cors: {origin: process.env.CORS_ORIGIN}
};

serve({userProfile}, session, options);