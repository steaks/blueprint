import {state, event} from "@blueprint/rx";
import {Session} from "@blueprint/rx/types";

const username = state("username", "steven")

const session$$ = {
  state: {username},
  events: {},
  hooks: {}
} as Session;

export default session$$;