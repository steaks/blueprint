import React from "react";
import {state, task, app} from "blueprint-react";
import {User} from "../../../shared/src/common";

//state
const useSearch = state<string>("team", "search");
const useNewUser = state<User | null>("team", "newUser");
const useUpdatedUser = state<User | null>("team", "updatedUser");
const useRemovedUser = state<User>("team", "removedUser");

//tasks
const useUsers = task<User[]>("team", "users");
const useAdd = task<null>("team", "add");
const useUpdate = task<null>("team", "update");
const useRemove = task<null>("team", "remove");

//App
const Team = app("team");

const Row = (p: { readonly user: User; }) => {
  const [, setUpdatedUser] = useUpdatedUser();
  const [, setRemovedUser] = useRemovedUser();
  const [, remove] = useRemove();

  const onRemove = () => {
    setRemovedUser(p.user);
    remove();
  };

  return (
    <tr key={p.user.id}>
      <td>{p.user.id}</td>
      <td>{p.user.name}</td>
      <td>
        <button onClick={() => setUpdatedUser(p.user)}>Edit</button>
      </td>
      <td>
        <button onClick={onRemove}>Remove</button>
      </td>
    </tr>
  );
};

const Browse = () => {
  const [search, setSearch] = useSearch();
  const [users] = useUsers();

  return (
    <>
      <h3>Users</h3>
      <input defaultValue={search} onChange={e => setSearch(e.currentTarget.value)} placeholder="Search"/>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Edit</th>
          <th>Remove</th>
        </tr>
        </thead>
        <tbody>
        {users && users.map(u => <Row user={u}/>)}
        </tbody>
      </table>
    </>
  );
};

const Add = () => {
  const [newUser, setNewUser] = useNewUser();
  const [, add] = useAdd();

  if (!newUser) {
    return (
      <>
        <button onClick={() => setNewUser({id: crypto.randomUUID(), name: ""})}>Add a New User</button>
      </>
    )
  }

  return (
    <>
      <h3>Add</h3>
      <label>Name: </label>
      <input defaultValue={newUser?.name} onChange={e => setNewUser({...newUser, name: e.currentTarget.value})}/>
      <br/>
      <button onClick={add}>Save</button>
      <button onClick={() => setNewUser(null)}>Cancel</button>
    </>
  );
};

const Edit = () => {
  const [updatedUser, setUpdatedUser] = useUpdatedUser();
  const [, setRemovedUser] = useRemovedUser();
  const [, update] = useUpdate();
  const [, remove] = useRemove();

  if (!updatedUser) {
    return <></>
  }

  const onRemove = () => {
    setRemovedUser(updatedUser);
    remove();
  };

  return (
    <>
      <h3>Edit</h3>
      <div>ID: {updatedUser.id}</div>
      <label>Name: </label>
      <input onChange={e => setUpdatedUser({...updatedUser!, name: e.currentTarget.value})}
             placeholder={updatedUser.name}/>
      <br/>
      <button onClick={onRemove}>Remove</button>
      <button onClick={update}>Save</button>
      <button onClick={() => setUpdatedUser(null)}>Cancel</button>
    </>
  )
};

const UI = () => {
  return (
    <Team>
      <div>
        <a href="http://localhost:3000">Home</a>
        <Browse/>
        <Add/>
        <Edit/>
      </div>
    </Team>
  );
};

export default UI;