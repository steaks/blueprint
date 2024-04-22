import {app, state, task, event, from, trigger, ref, get, set} from "blueprint-server";
import {db} from "../postgres";
import {User} from "../../../shared/src/common";
import {StateRef} from "blueprint-server/types/types";

const onRemove = async (selectedRef: StateRef<User | null>): Promise<void> => {
  const selected = get(selectedRef);
  if (!selected) {
    return;
  }
  const cnt = await db.one<number>(`SELECT COUNT(*) AS cnt FROM users WHERE id = '${selected.id}'`, [], row => Number(row.cnt));
  if (cnt === 0) {
    set(selectedRef, null);
  }
};

const users = async (search: string): Promise<User[]> =>
  await db.map<User>(`SELECT id, name FROM users WHERE '${search}' = '' OR name LIKE '%${search}%' ORDER BY name`, {search}, row => ({
    id: row.id,
    name: row.name
  }));

const addUser = async (user: User | null): Promise<void> => {
  if (user) {
    await db.none(`INSERT INTO users(id, name) VALUES('${user.id}', '${user.name}')`);
  }
};

const removeUser = async (user: User): Promise<void> => {
  await db.none(`DELETE FROM users WHERE id = '${user.id}'`);
};

const updateUser = async (selected: User | null): Promise<void> => {
  if (selected) {
    await db.none(`UPDATE users SET name = '${selected.name}' WHERE id = '${selected.id}'`, []);
  }
};

const onUpdate = (updatedUser: StateRef<User | null>) => {
  set(updatedUser, null);
};

const onAdd = (newUser: StateRef<User | null>) => {
  set(newUser, null);
};

const team$$ = app(() => {
  const search$ = state("search", "");
  const newUser$ = state<User | null>("newUser", null);
  const updatedUser$ = state<User | null>("updatedUser", null);
  const removedUser$ = state<User | null>("removedUser", null);

  const usersChanged$ = event("usersChanged");

  const users$ = task(
    {name: "users", triggers: ["stateChanges", usersChanged$]},
    from(users, search$),
  );

  const add$ = task(
    {name: "add", triggers: ["self"]},
    from(addUser, newUser$),
    trigger(usersChanged$),
  );

  const remove$ = task(
    {name: "remove", triggers: ["self"]},
    from(removeUser, removedUser$),
    trigger(usersChanged$)
  );

  const update$ = task(
    {name: "update", triggers: ["self"]},
    from(updateUser, updatedUser$),
    trigger(usersChanged$)
  );

  const onAdd$ = task(
    {name: "onAdd", triggers: [add$]},
    from(onAdd, ref(newUser$))
  );

  const onRemove$ = task(
    {name: "onAdd", triggers: [remove$]},
    from(onRemove, ref(updatedUser$))
  );

  const onUpdate$ = task(
    {name: "onUpdate", triggers: [update$]},
    from(onUpdate, ref(updatedUser$))
  );

  return {
    name: "team",
    state: [search$, newUser$, updatedUser$, removedUser$],
    events: [usersChanged$],
    tasks: [users$, add$, remove$, update$, onUpdate$, onRemove$, onAdd$]
  };
});

export default team$$;

//POST http://localhost:8080/users/search?body={search}
//POST http://localhost:8080/users/newUser?body={newUser}
//POST http://localhost:8080/users/add
//POST http://localhost:8080/users/remove

//Webtask Events
//
//{name: "/users/users", string[]}
//{name: "/users/count", number}

/*
- Build levels 1-4
- Relationship to datastores
- What is foreign vs. native (e.g. imports)
- Look into C4 diagraming
- Rendering embedded in vscode
- Support for expand/collapse of all the diagrams
 */