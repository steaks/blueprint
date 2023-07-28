import rxblueprint, {Session} from "./rx-blueprint/rxblueprint";
const {state, event} = rxblueprint

const username = state("username", "steven")
const newDeposits = event("newDeposits");

const session$$ = {
  state: {username},
  events: {newDeposits},
  hooks: {}
} as Session;

export default session$$;