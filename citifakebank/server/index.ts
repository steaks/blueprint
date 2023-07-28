import rxblueprint from "./rx-blueprint/rxblueprint";
import history from "./apps/history";
import balance from "./apps/account/balance";
import activity from "./apps/account/activity";
import session from "./session";
import atm from "./apps/account/atm";
import team from "./apps/team";

rxblueprint.serve({team, history, balance, activity, atm}, session, 8080);