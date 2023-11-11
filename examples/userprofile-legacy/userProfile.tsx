import React, {useCallback, useEffect, useState} from "react";
import {useEmail, useFirstName, useLastName, useSave, UserProfile, useUser} from "../apps/userProfile";
import {User} from "../../../shared/src/apps/userProfile";

const get = async <T, >(uri: string): Promise<T> => {
  const response = await fetch(uri);
  return await response.json();
};

const post = async <T, >(uri: string): Promise<T> => {
  const response = await fetch(uri, {method: "POST"});
  return await response.json();
};

const UserProfileUI = () => {
  const [user, setUser] = useState<User>({email: "", firstName: "", lastName: ""});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    get<User>("user").then(setUser);
  }, []);

  useEffect(() => {
    get<string>("/userName").then(setUserName)
  }, [email, firstName, lastName]);

  const save = useCallback(() => {
    post<User>("/user")
      .then(() => get<User>("user"))
      .then(setUser);
  }, []);


  return (
    <div>
      <strong>User:</strong>
      <div>Email: {user?.email}</div>
      <div>First name: {user?.firstName}</div>
      <div>Last name: {user?.lastName}</div>
      <hr/>
      <strong>Edit:</strong>
      <div>
        <div>Username: {userName}</div>
      </div>
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
    </div>
  );
};

export default UserProfileUI;