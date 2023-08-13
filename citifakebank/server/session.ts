import {state, event} from "@blueprint/rx";
import {Session} from "@blueprint/rx/types";

const username = state("username", "steven")
const newDeposits = event("newDeposits");
const newWithdrawals = event("newWithdrawals");
const newFees = event("newFees");

const session$$ = {
  state: {username},
  events: {newDeposits, newWithdrawals, newFees},
  hooks: {}
} as Session;

export default session$$;