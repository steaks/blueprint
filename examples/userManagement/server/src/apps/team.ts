import {
  app,
  ref,
  get,
  set,
  useQuery,
  useEffect,
  useState,
  useEvent
} from "blueprint-server";
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

const add = async (user: User | null): Promise<void> => {
  if (user) {
    await db.none(`INSERT INTO users(id, name) VALUES('${user.id}', '${user.name}')`);
  }
};

const remove = async (user: User): Promise<void> => {
  await db.none(`DELETE FROM users WHERE id = '${user.id}'`);
};

const update = async (selected: User | null): Promise<void> => {
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
  const search$ = useState("search", "");
  const newUser$ = useState<User | null>("newUser", null);
  const updatedUser$ = useState<User | null>("updatedUser", null);
  const removedUser$ = useState<User | null>("removedUser", null);
  const usersChanged$ = useEvent("usersChanged");
  const users$ = useQuery(users, [search$], {triggers: ["deps", usersChanged$]})
  const add$ = useEffect(add, [newUser$], {onSuccess: [usersChanged$]});
  const remove$ = useEffect(remove, [removedUser$], {onSuccess: [usersChanged$]})
  const update$ = useEffect(update, [updatedUser$], {onSuccess: [usersChanged$]});
  const onAdd$ = useEffect(onAdd, [ref(newUser$)], {triggers: [add$], onSuccess: [usersChanged$]});
  const onRemove$ = useEffect(onRemove, [ref(removedUser$)], {triggers: [remove$], onSuccess: [usersChanged$]});
  const onUpdate$ = useEffect(onUpdate, [ref(updatedUser$)], {triggers: [update$], onSuccess: [usersChanged$]});

  return {
    name: "team",
    state: [search$, newUser$, updatedUser$, removedUser$],
    events: [usersChanged$],
    queries: [users$],
    effects: [add$, remove$, update$, onUpdate$, onRemove$, onAdd$],
  };
});

export default team$$;