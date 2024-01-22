# Rx Blueprint


Rx Blueprint allows you to build reactive applications with less code than single-page application architectures. The architecture creates a single event and state system to be used across frontend and server code. Server and frontend code may hook into the events and state changes to build business logic. This more cohesive system allows you to:

1. Simplify state management 
2. Simplify component interactions
3. Simplify networking + caching
4. Remove http routing boilerplate

# Getting Started

This tutorial will show you how to build a simple website. It'll cover 80% of Rx Blueprint concepts.

## Architecture and core components
In Rx Blueprint you build "apps" using events, state, operators, and hooks. Then you serve your apps and connect your apps to Reach using rx-react. You do not need to worry about webserver routing or networking between frontend and server. Just build events, state, and business logic. Blueprint handles the rest!

*Events -* Signals that can kick off hooks. Use events to signal that a button has been clicked or a table has been updated in the database.

*State -* System to keep track of variables. State changes can trigger hooks. State values can be leveraged in hooks. Use states to track inputs from a user (e.g. text inputs, switch button state).

*Hooks -* Business logic that may be triggered by events or state changes. Use hooks to query your database, insert into your database, run calculations, etc. A hook may also kick off events and make state changes.

*Operators -* Thin layer that connects vanilla javascript functions with Hooks.

## Example - User Profile Page

We will create a user profile page to demonstrate these concepts in action. The page will display a user's email, first name, and last name, and it will allow edits to each of these. We will do the following to build the user page:

1. Build the server-side app
2. Serve the app
3. Share common types between server and frontend
4. Connect the app to React
5. Build the React UI
6. Understand the Blueprint UI
7. Run the server, frontend, and blueprint ui

For the full example see [userprofile](https://github.com/steaks/blueprint/tree/main/userprofile).

### Build the server-side app

First, we'll build a mock database. This is not part of the blueprint app, but we need to simulate a db to build a realistic app.

```
const db = {
  email: "",
  firstName: "",
  lastName: ""
};

const queryUser = () =>
  Promise.resolve({email: db.email, firstName: db.firstName, lastName: db.lastName})

const updateUser = (email: string, firstName: string, lastName: string): Promise<string> => {
  db.email = email;
  db.firstName = firstName;
  db.lastName = lastName;
  return Promise.resolve("Saved to db!");
};
```

Next, we'll set up state. We need to keep track of edits to the email, first name, and last name, so we create a state variable for each of those. 
```
const email$ = state<string>("email");
const firstName$ = state<string>("firstName");
const lastName$ = state<string>("lastName");
```


Then we create an event, "save", which will be fired when a user clicks the save button. 
```
const save$ = event("save");
```

Next, we create hooks to implement our business logic. The first hook will query the database for the user's profile. The second hook will update the user in the database when save is fired.
```
const user$ = hook(
  "user",
  {}, //using default options
  operator(queryUser)
);

const onSave$ = hook(
  "onSave",
  {triggers: [save$]},
  operator(updateUser, email$, firstName$, lastName$),
  trigger(user$)
);
```

Finally, we put it all together.

```
import {app, state, event, hook, operator, trigger} from "@blueprint/server";
import {User} from "../../../shared/src/apps/userProfile";

const db = {
  email: "",
  firstName: "",
  lastName: ""
};

const queryUser = (): Promise<User> =>
  Promise.resolve({email: db.email, firstName: db.firstName, lastName: db.lastName})

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
    {}, //use default options
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
```

### Serve the App
Create a session and serve the app.

```
import {serve} from "@blueprint/server";
import userProfile from "./apps/userProfile";
import session from "./session";

serve({userProfile}, session);
```

### Share common types

The server and frontend will use the User type. We put shared types in the `shared` directory.

```
export interface User {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}
```

### Connect the App to React

Use rx-react to connect your app's state, events, and hooks, and create a component that wraps the app.

```
import {app, state, event, hook} from "../rxreact"
import {User} from "../../../shared/src/apps/userProfile";

export const useEmail = state<string>("userProfile", "email");
export const useFirstName = state<string>("userProfile", "firstName");
export const useLastName = state<string>("userProfile", "lastName");

export const useSave = event("userProfile", "save");

export const useUser = hook<User>("userProfile", "user");

export const UserProfile = app("userProfile");
```

### Build the React UI

Build a React UI using the `UserProfile` component and hooks you created when connecting the Rx Blueprint app to React. 

```
import React from "react";
import {useEmail, useFirstName, useLastName, useSave, UserProfile, useUser} from "../apps/userProfile";

const UserProfileUI = () => {
  const [user] = useUser();
  const [email, setEmail] = useEmail();
  const [firstName, setFirstName] = useFirstName();
  const [lastName, setLastName] = useLastName();

  const [save] = useSave();

  return (
    <UserProfile>
      <strong>User:</strong>
      <div>Email: {user?.email}</div>
      <div>First name: {user?.firstName}</div>
      <div>Last name: {user?.lastName}</div>
      <hr/>
      <strong>Edit:</strong>
      <div>
        <input defaultValue={email} onChange={e => setEmail(e.currentTarget.value)} placeholder="Email"/>
      </div>
      <div>
        <input defaultValue={firstName} onChange={e => setFirstName(e.currentTarget.value)} placeholder="First Name"/>
      </div>
      <div>
        <input defaultValue={lastName} onChange={e => setLastName(e.currentTarget.value)} placeholder="Last Name"/>
      </div>
      <button onClick={save}>Save</button>
    </UserProfile>
  );
};

export default UserProfileUI;
```

### Understand the Blueprint UI

Along with your application you will get a blueprint ui for free. The blueprint UI is a flow-diagram that shows the architecture of your apps.

### Run the server, frontend and blueprint ui

```
1. make install # in root directory of repo
2. make build # in root directory of repo
3. cd userprofile
4. make run-server # Run in separate terminal.
5. make run-ui # Run in separate terminal. Open browser to http://localhost:3000
```

Explore the userprofile [codebase](https://github.com/steaks/blueprint/tree/main/userprofile)