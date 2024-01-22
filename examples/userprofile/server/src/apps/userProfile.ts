import {app, state, event, task, trigger, from} from "blueprint-server";
import {User} from "../../../shared/src/apps/userProfile";

const db = {
  email: "",
  firstName: "",
  lastName: ""
};

const queryUser = (): Promise<User> =>
  Promise.resolve({email: db.email, firstName: db.firstName, lastName: db.lastName});

const updateUser = (email: string, firstName: string, lastName: string): Promise<string> => {
  db.email = email;
  db.firstName = firstName;
  db.lastName = lastName;
  return Promise.resolve("Saved to db!");
};

const userProfile$$ = app(() => {
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

export default userProfile$$;