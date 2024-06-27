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
import {User, Team, Task} from "../../../shared/src/common";
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

  await db.none(`UPDATE tasks SET owner_id = NULL WHERE owner_id = '${selected.id}'`);
};

const users = async (search: string): Promise<User[]> =>
  await db.map<User>(`SELECT id, team_id, name FROM users WHERE '${search}' = '' OR name LIKE '%${search}%' ORDER BY name`, {search}, row => ({
    id: row.id,
    teamId: row.team_id,
    name: row.name
  }));

const add = async (user: User | null): Promise<void> => {
  if (user) {
    await db.none(`INSERT INTO users(id, name, team_id) VALUES('${user.id}', '${user.name}', '${user.teamId}')`);
  }
};

const remove = async (user: User): Promise<void> => {
  await db.none(`DELETE FROM users WHERE id = '${user.id}'`);
};

const update = async (selected: User | null): Promise<void> => {
  if (selected) {
    await db.none(`UPDATE users SET name = '${selected.name}', team_id = '${selected.teamId}' WHERE id = '${selected.id}'`, []);
  }
};

const onUpdate = (updatedUser: StateRef<User | null>) => {
  set(updatedUser, null);
};

const onAdd = (newUser: StateRef<User | null>) => {
  set(newUser, null);
};

const teams = async (): Promise<Team[]> =>
  await db.map<Team>(`SELECT * FROM teams`, {}, r => ({id: r.id, name: r.name}))

const addTeam = async (team: Team | null): Promise<void> => {
  if (team) {
    await db.none(`INSERT INTO teams(id, name) VALUES('${team.id}', '${team.name}')`);
  }
};

const onAddTeam = (newTeam: StateRef<Team | null>) => {
  set(newTeam, null);
};

const updateTeam = async (selected: Team | null): Promise<void> => {
  if (selected) {
    await db.none(`UPDATE teams SET name = '${selected.name}' WHERE id = '${selected.id}'`, []);
  }
};

const removeTeam = async (team: Team | null): Promise<void> => {
  if (team) {
    await db.none(`DELETE FROM teams WHERE id = '${team.id}'`);
  }
};

const onRemoveTeam = async (removedTeam: StateRef<Team | null>) => {
  const removed = get(removedTeam);
  if (removed) {
    set(removedTeam, null);
    await db.none(`UPDATE users SET team_id = NULL WHERE team_id = '${removed.id}'`);
  }
};

const onUpdateTeam = (updatedTeam: StateRef<Team | null>) => {
  set(updatedTeam, null);
};

const tasks = async (): Promise<Task[]> =>
  await db.map<Task>(`SELECT * FROM tasks`, {}, r => ({
    id: r.id,
    name: r.name,
    ownerId: r.owner_id,
    status: r.status,
  }));

const addTask = async (task: Task | null) => {
  if (task) {
    await db.none(`INSERT INTO tasks(id, name, owner_id, status) VALUES('${task.id}', '${task.name}', '${task.ownerId}', '${task.status}')`);
  }
};

const onAddTask = (newTask: StateRef<Task | null>) => {
  set(newTask, null);
};

const removeTask = async (task: Task | null): Promise<void> => {
  if (task) {
    await db.none(`DELETE FROM tasks WHERE id = '${task.id}'`);
  }
};

const onRemoveTask = (removedTask: StateRef<Task | null>) => {
  set(removedTask, null);
};

const updateTask = async (selected: Task | null): Promise<void> => {
  if (selected) {
    await db.none(`UPDATE tasks SET name = '${selected.name}', owner_id = '${selected.ownerId}', status = '${selected.status}' WHERE id = '${selected.id}'`, []);
  }
};

const onUpdateTask = (updatedTask: StateRef<Task | null>) => {
  set(updatedTask, null);
};

const foo = {
  users
};

const dashboard = app(() => {
  //users
  const search$ = useState("search", "");
  const newUser$ = useState<User | null>("newUser", null);
  const updatedUser$ = useState<User | null>("updatedUser", null);
  const removedUser$ = useState<User | null>("removedUser", null);
  const usersChanged$ = useEvent("usersChanged");
  const users$ = useQuery(users, [search$], {triggers: ["deps", usersChanged$]})
  const add$ = useEffect(add, [newUser$]);
  const remove$ = useEffect(remove, [removedUser$]);
  const update$ = useEffect(update, [updatedUser$]);
  const onAdd$ = useEffect(onAdd, [ref(newUser$)], {triggers: [add$], onSuccess: [usersChanged$]});
  const onRemove$ = useEffect(onRemove, [ref(removedUser$)], {triggers: [remove$], onSuccess: [usersChanged$]});
  const onUpdate$ = useEffect(onUpdate, [ref(updatedUser$)], {triggers: [update$], onSuccess: [usersChanged$]});

  //teams
  const teamsChanged$ = useEvent("teamsChanged");
  const teams$ = useQuery(teams, [], {triggers: ["deps", teamsChanged$]});
  const newTeam$ = useState<Team | null>("newTeam", null);
  const updatedTeam$ = useState<Team | null>("updatedTeam", null);
  const removedTeam$ = useState<Team | null>("removedTeam", null);
  const addTeam$ = useEffect(addTeam, [newTeam$]);
  const removeTeam$ = useEffect(removeTeam, [removedTeam$]);
  const updateTeam$ = useEffect(updateTeam, [updatedTeam$]);
  const onAddTeam$ = useEffect(onAddTeam, [ref(newTeam$)], {triggers: [addTeam$], onSuccess: [teamsChanged$]});
  const onRemoveTeam$ = useEffect(onRemoveTeam, [ref(removedTeam$)], {triggers: [removeTeam$], onSuccess: [teamsChanged$]});
  const onUpdateTeam$ = useEffect(onUpdateTeam, [ref(updatedTeam$)], {triggers: [updateTeam$], onSuccess: [teamsChanged$]});

  //tasks
  const tasksChanged$ = useEvent("tasksChanged");
  const tasks$ = useQuery(tasks, [], {triggers: ["deps", tasksChanged$, usersChanged$, teamsChanged$]});
  const newTask$ = useState<Task | null>("newTask", null);
  const removedTask$ = useState<Task | null>("removedTask", null);
  const updatedTask$ = useState<Task | null>("updatedTask", null);
  const addTask$ = useEffect(addTask, [newTask$]);
  const onAddTask$ = useEffect(onAddTask, [ref(newTask$)], {triggers: [addTask$], onSuccess: [tasksChanged$]});
  const removeTask$ = useEffect(removeTask, [removedTask$]);
  const onRemoveTask$ = useEffect(onRemoveTask, [ref(removedTask$)], {triggers: [removeTask$], onSuccess: [tasksChanged$]});
  const updateTask$ = useEffect(updateTask, [updatedTask$]);
  const onUpdateTask$ = useEffect(onUpdateTask, [ref(updatedTask$)], {triggers: [updateTask$], onSuccess: [tasksChanged$]});


  return {
    name: "dashboard",
    state: [search$, newUser$, updatedUser$, removedUser$, newTeam$, updatedTeam$, removedTeam$, newTask$, removedTask$, updatedTask$],
    events: [usersChanged$, teamsChanged$, tasksChanged$],
    queries: [users$, teams$, tasks$],
    effects: [add$, remove$, update$, onUpdate$, onRemove$, onAdd$, addTeam$, onAddTeam$, removeTeam$, onRemoveTeam$, updateTeam$, onUpdateTeam$, addTask$, onAddTask$, removeTask$, onRemoveTask$, updateTask$, onUpdateTask$],
  };
});

export default dashboard;