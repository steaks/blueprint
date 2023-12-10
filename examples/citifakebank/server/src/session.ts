import {state, event} from "@blueprint/server";
import {Session} from "@blueprint/server/types";

const username = state("username", "steven")
const newDeposits = event("newDeposits");
const newWithdrawals = event("newWithdrawals");
const newFees = event("newFees");

const session$$ = {
  state: {username},
  events: {newDeposits, newWithdrawals, newFees},
  tasks: {}
} as Session;

export default session$$;