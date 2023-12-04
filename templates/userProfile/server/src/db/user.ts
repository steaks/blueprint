import {User} from "../../../shared/src/apps/userProfile";

const db = {email: "", firstName: "", lastName: ""};

export const queryUser = (): Promise<User> =>
  Promise.resolve({email: db.email, firstName: db.firstName, lastName: db.lastName});

export const updateUser = (email: string, firstName: string, lastName: string): Promise<string> => {
  db.email = email;
  db.firstName = firstName;
  db.lastName = lastName;
  return Promise.resolve("Saved to db!");
};