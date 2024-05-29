import {app, useEffect, useEvent, useQuery, useState} from "blueprint-server";
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
  const email$ = useState<string>("email");
  const firstName$ = useState<string>("firstName");
  const lastName$ = useState<string>("lastName");

  const save$ = useEvent("save");
  const user$ = useQuery(queryUser, [], {name: "user"});
  const onSave$ = useEffect(updateUser, [email$, firstName$, lastName$], {name: "onSave", triggers: [save$], onSuccess: [user$]})

  return {
    name: "userProfile",
    state: [email$, firstName$, lastName$],
    events: [save$],
    queries: [user$, onSave$],
    effects: [onSave$]
  };
});

export default userProfile$$;