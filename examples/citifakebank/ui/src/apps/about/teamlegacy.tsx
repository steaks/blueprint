import React, {useState, useEffect} from "react";
import {User} from "../../../../shared/src/common";

const db = {
  users: [] as User[],
  insert: async (user: User) => {
    db.users.push(user)
    return Promise.resolve(null);
  },
  update: async (user: User) => {
    db.users = db.users.map(u => u.id === user.id ? user : u)
    return Promise.resolve(null);
  },
  remove: async (user: User) => {
    db.users = db.users.filter(u => u.id !== user.id)
    return Promise.resolve(null);
  }
};

const server = {
  fetchUsers: (search: string): Promise<User[]> => {
    return Promise.resolve(db.users.filter(u => !search || u.name.includes(search)));
  },
  fetchUser: (id: string): Promise<User | null> => {
    return Promise.resolve(db.users.filter(u => u.id === id)[0] || null)
  },
  fetchCount: (): Promise<number> => {
    return Promise.resolve(db.users.length);
  },
  add: (user: User): Promise<null> => {
    return db.insert(user);
  },
  update: (user: User): Promise<null> => {
    return db.update(user);
  },
  remove: (user: User): Promise<null> => {
    return db.remove(user);
  },

};

const UI = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    const users = await server.fetchUsers(search);
    setUsers(users);
  };

  const fetchCount = async () => {
    const count = await server.fetchCount();
    setCount(count);
  };

  const fetchAll = async () =>
    Promise.all([fetchUsers(), fetchCount()]);

  const add = async (user: User) => {
    await server.add(user);
    await fetchAll();
  };

  const remove = async (user: User) => {
    await server.remove(user);
    await fetchAll();
    if (selectedUser) {
      const u = await server.fetchUser(selectedUser.id);
      if (u === null) {
        setSelectedUser(null);
      }
    }
  };

  const update = async (user: User) => {
    await server.update(user);
    setSelectedUser(null);
    await fetchAll();
  };

  const edit = (user: User) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    fetchUsers()
  }, [search]);

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div>
      <a href="http://localhost:3000">Home</a>
      <Browse
        users={users}
        count={count}
        search={search}
        setSearch={setSearch}
        remove={remove}
        edit={edit}
      />
      <Add
        add={add}
      />
      <Edit
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        update={update}
        remove={remove}
      />
    </div>
  );
};

interface AddProps {
  readonly add: (user: User) => void;
}

const Add = (props: AddProps) => {
  const {add} = props;
  const [newUser, setNewUser] = useState<User | null>(null);
  const onSave = () => {
    add(newUser!);
    setNewUser(null);
  };

  if (!newUser) {
    return (
      <>
        <h3>Add</h3>
        <button onClick={() => setNewUser({id: crypto.randomUUID(), name: ""})}>Add a New User</button>
      </>
    );
  }

  return (
    <>
      <h3>Add</h3>
      <label>Name: </label>
      <input defaultValue={newUser?.name} onChange={e => setNewUser({...newUser, name: e.currentTarget.value})}/>
      <br/>
      <button onClick={onSave}>Save</button>
      <button onClick={() => setNewUser(null)}>Cancel</button>
    </>
  );
};

interface EditProps {
  readonly selectedUser: User | null;
  readonly setSelectedUser: (user: User | null) => void;
  readonly update: (user: User) => void;
  readonly remove: (user: User) => void;
}

const Edit = (props: EditProps) => {
  const {selectedUser, setSelectedUser, update, remove} = props;

  const onSave = () => {
    update(selectedUser!);
  };

  const onCancel = () => {
    setSelectedUser(null);
  };

  if (!selectedUser) {
    return <></>
  }

  return (
    <>
      <h3>Edit</h3>
      <div>ID: {selectedUser.id}</div>
      <label>Name: </label>
      <input onChange={e => setSelectedUser({...selectedUser!, name: e.currentTarget.value})}
             placeholder={selectedUser.name}/>
      <br/>
      <button onClick={() => remove(selectedUser)}>Remove</button>
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </>
  )
};

interface RowProps {
  readonly user: User;
  readonly edit: (user: User) => void;
  readonly remove: (user: User) => void;
}

const Row = (props: RowProps) => {
  const {user, edit, remove} = props;
  return (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>
        <button onClick={() => edit(user)}>Edit</button>
      </td>
      <td>
        <button onClick={() => remove(user)}>Remove</button>
      </td>
    </tr>
  );
};

interface UsersProps {
  readonly users: User[];
  readonly count: number;
  readonly search: string;
  readonly setSearch: (search: string) => void;
  readonly remove: (user: User) => void;
  readonly edit: (user: User) => void;
}

const Browse = (p: UsersProps) => {
  const {users, count, search, edit, setSearch, remove} = p;
  return (
    <>
      <h3>Users ({count})</h3>
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
        {users && users.map(u => <Row user={u} edit={edit} remove={remove}/>)}
        </tbody>
      </table>
    </>
  );
};

export default UI;