import rxblueprint from "@blueprint/rx";
import history from "./apps/history";
import balance from "./apps/balance";
import activity from "./apps/activity";
import session from "./session";
import atm from "./apps/atm";
import team from "./apps/team";

rxblueprint.serve({team, history, balance, activity, atm}, session);