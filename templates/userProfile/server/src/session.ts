import {state} from "blueprint-server";
import {Session} from "blueprint-server/types";

const username = state("username", "steven")

const session = {
  state: {username},
  events: {},
  tasks: {}
} as Session;

export default session;