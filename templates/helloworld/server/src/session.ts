import {state, event} from "blueprint-server";
import {Session} from "blueprint-server/types";

const username = state("username", "steven")

const session$$ = {
  state: {username},
  events: {},
  hooks: {}
} as Session;

export default session$$;