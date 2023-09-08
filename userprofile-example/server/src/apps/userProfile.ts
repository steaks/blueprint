import {app, state, event, hook, operator, trigger} from "@blueprint/rx";
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

export default userProfile$$;