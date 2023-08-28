import {serve} from "@blueprint/rx";
import userProfile from "./apps/userProfile";
import session from "./session";

serve({userProfile}, session);