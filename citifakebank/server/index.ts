import {serve} from "@blueprint/rx";
import history from "./src/apps/history";
import balance from "./src/apps/balance";
import activity from "./src/apps/activity";
import session from "./session";
import atm from "./src/apps/atm";
import team from "./src/apps/team";

serve({team, history, balance, activity, atm}, session);