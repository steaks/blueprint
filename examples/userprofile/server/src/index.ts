import {serve} from "@blueprint/server";
import userProfile from "./apps/userProfile";
import session from "./session";

serve({userProfile}, session);