import {app, state, event, task, from, trigger} from "blueprint-server";
import {queryUser, updateUser} from "../db/user";

export default app(() => {
  const email$ = state<string>("email");
  const firstName$ = state<string>("firstName");
  const lastName$ = state<string>("lastName");

  const save$ = event("save");

  const user$ = task(
    {name: "user"},
    from(queryUser)
  );

  const onSave$ = task(
    {name: "onSave", triggers: [save$]},
    from(updateUser, email$, firstName$, lastName$),
    trigger(user$)
  );

  return {
    name: "userProfile",
    state: [email$, firstName$, lastName$],
    events: [save$],
    tasks: [user$, onSave$]
  };
});