import {create} from "blueprint-server";
import history from "./apps/history";
import balance from "./apps/balance";
import activity from "./apps/activity";
import session from "./session";
import atm from "./apps/atm";
import team from "./apps/team";

const options = {
  cors: {origin: process.env.CORS_ORIGIN}
};

const bp = create({team, history, balance, activity, atm}, session);
bp.serve(options);