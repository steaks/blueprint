import {app, state, event, hook, operator, trigger} from "blueprint-server";
import {queryUser, updateUser} from "../db/user";

export default app(() => {
  const email$ = state<string>("email");
  const firstName$ = state<string>("firstName");
  const lastName$ = state<string>("lastName");

  const save$ = event("save");

  const user$ = hook(
    "user",
    {},
    operator(queryUser)
  );

  const onSave$ = hook(
    "onSave",
    {triggers: [save$]},
    operator(updateUser, email$, firstName$, lastName$),
    trigger(user$)
  );

  return {
    name: "userProfile",
    state: [email$, firstName$, lastName$],
    events: [save$],
    hooks: [user$, onSave$]
  };
});