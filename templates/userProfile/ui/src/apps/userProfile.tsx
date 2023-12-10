import React from "react";
import {app, state, event, task} from "blueprint-react"
import {User} from "../../../shared/src/apps/userProfile";

export const useEmail = state<string>("userProfile", "email");
export const useFirstName = state<string>("userProfile", "firstName");
export const useLastName = state<string>("userProfile", "lastName");
export const useSave = event("userProfile", "save");
export const useUser = task<User>("userProfile", "user");
export const UserProfile = app("userProfile");

const UI = () => {
  const [user] = useUser();
  const [email, setEmail] = useEmail();
  const [firstName, setFirstName] = useFirstName();
  const [lastName, setLastName] = useLastName();

  const [save] = useSave();

  return (
    <UserProfile>
      <a href="/">&lt; Home</a>
      <h1>User Profile!</h1>
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

export default UI;