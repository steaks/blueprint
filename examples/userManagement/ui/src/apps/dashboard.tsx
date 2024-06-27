import React, {useState} from "react";
import {state, app, query, effect} from "blueprint-react";
import {User, Team, Task} from "../../../shared/src/common";
import {
  AppBar,
  Box,
  Button,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
  useTheme
} from "@mui/material";
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";

//users
const useSearch = state<string>("dashboard", "search");
const useNewUser = state<User | null>("dashboard", "newUser");
const useUpdatedUser = state<User | null>("dashboard", "updatedUser");
const useRemovedUser = state<User>("dashboard", "removedUser");
const useUsers = query<User[]>("dashboard", "users");
const useAdd = effect<null>("dashboard", "add");
const useUpdate = effect<null>("dashboard", "update");
const useRemove = effect<null>("dashboard", "remove");

//teams
const useTeams = query<Team[]>("dashboard", "teams");
const useAddTeam = effect<null>("dashboard", "addTeam");
const useNewTeam = state<Team | null>("dashboard", "newTeam");
const useUpdatedTeam = state<Team | null>("dashboard", "updatedTeam");
const useRemovedTeam = state<Team | null>("dashboard", "removedTeam");
const useUpdateTeam = effect<null>("dashboard", "updateTeam");
const useRemoveTeam = effect<null>("dashboard", "removeTeam");

//tasks
const useTasks = query<Task[]>("dashboard", "tasks");
const useNewTask = state<Task | null>("dashboard", "newTask");
const useAddTask = effect<null>("dashboard", "addTask");
const useRemovedTask = state<Task>("dashboard", "removedTask");
const useRemoveTask = effect<null>("dashboard", "removeTask");
const useUpdatedTask = state<Task | null>("dashboard", "updatedTask");
const useUpdateTask = effect<null>("dashboard", "updateTask");


//App
const Dashboard = app("dashboard");

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const Browse = () => {
  const [users] = useUsers();
  const [teams] = useTeams();
  const [, setUpdatedUser] = useUpdatedUser();
  const [, setRemovedUser] = useRemovedUser();
  const [remove] = useRemove();
  const [newUser, setNewUser] = useNewUser();
  const defaultTeamId = teams ? teams[0].id : undefined;

  const onRemove = (user: User) => {
    setRemovedUser(user);
    remove();
  };

  const rows = (users || []).map(u => {
    const team = teams?.find(t => t.id === u.teamId)?.name;
    return ({
      id: u.id,
      name: u.name,
      team,
      edit: u,
      remove: u
    });
  });

  const columns: GridColDef[] = [
    {field: "id", headerName: "ID"},
    {field: "name", headerName: "Name"},
    {field: "team", headerName: "Team"},
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (p) => <Button variant="contained" onClick={() => setUpdatedUser(p.value)}>Edit</Button>
    },
    {
      field: "remove",
      headerName: "Remove",
      renderCell: (p) => <Button variant="contained" onClick={() => onRemove(p.value)}>Remove</Button>
    },
  ];

  return (
    <>
      <Box display="flex" justifyContent="end" mb={1}>
        <Button variant="contained" onClick={() => setNewUser({id: crypto.randomUUID(), name: "", teamId: defaultTeamId})}>+ New User</Button>
      </Box>
      <DataGrid rows={rows} columns={columns}/>
    </>

  );
};

const Add = () => {
  const [newUser, setNewUser] = useNewUser();
  const [add] = useAdd();
  const [teams] = useTeams();

  const onTeamSelect = (e: SelectChangeEvent) => {
    const teamId = teams?.find(t => t.id === e.target.value)?.id;
    setNewUser({...newUser!, teamId});
  };

  if (!newUser) {
    return <></>;
  }

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <h3>Add User</h3>
        <InputLabel>Name</InputLabel>
        <TextField defaultValue={newUser?.name} onChange={e => setNewUser({...newUser, name: e.target.value})}/>
        <br/>
        <InputLabel>Team</InputLabel>
        <Select onChange={e => onTeamSelect(e)} value={newUser?.teamId}>
          {teams?.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
        </Select>
        <br/>
        <Button variant="contained" onClick={add}>Save</Button>
        <Button variant="contained" onClick={() => setNewUser(null)}>Cancel</Button>
      </Box>
    </Modal>
  );
};

const Edit = () => {
  const [updatedUser, setUpdatedUser] = useUpdatedUser();
  const [, setRemovedUser] = useRemovedUser();
  const [update] = useUpdate();
  const [remove] = useRemove();
  const [teams] = useTeams();

  if (!updatedUser) {
    return <></>
  }

  const onRemove = () => {
    setRemovedUser(updatedUser);
    remove();
  };

  const onTeamSelect = (e: SelectChangeEvent) => {
    const teamId = teams?.find(t => t.id === e.target.value)?.id;
    setUpdatedUser({...updatedUser, teamId});
  };

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <h3>Edit</h3>
        <div>ID: {updatedUser.id}</div>
        <label>Name: </label>
        <TextField onChange={e => setUpdatedUser({...updatedUser!, name: e.target.value})}
                   placeholder={updatedUser.name}/>
        <br/>
        <label>Team: </label>
        <Select onChange={e => onTeamSelect(e)} value={updatedUser.teamId}>
          {teams?.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
        </Select>
        <br/>
        <Button variant="contained" onClick={onRemove}>Remove</Button>
        <Button variant="contained" onClick={update}>Save</Button>
        <Button variant="contained" onClick={() => setUpdatedUser(null)}>Cancel</Button>
      </Box>
    </Modal>
  )
};

const AddTeam = () => {
  const [newTeam, setNewTeam] = useNewTeam();
  const [addTeam] = useAddTeam();

  if (!newTeam) {
    return <></>;
  }

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <h3>Add Team</h3>
        <label>Name: </label>
        <TextField defaultValue={newTeam?.name} onChange={e => setNewTeam({...newTeam!, name: e.target.value})}/>
        <br/>
        <Button variant="contained" onClick={addTeam}>Save</Button>
        <Button variant="contained" onClick={() => setNewTeam(null)}>Cancel</Button>
      </Box>
    </Modal>
  );
};

const EditTeam = () => {
  const [updatedTeam, setUpdatedTeam] = useUpdatedTeam();
  const [, setRemovedTeam] = useRemovedTeam();
  const [update] = useUpdateTeam();
  const [remove] = useRemoveTeam();

  if (!updatedTeam) {
    return <></>
  }

  const onRemove = () => {
    setRemovedTeam(updatedTeam);
    remove();
  };

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <h3>Edit</h3>
        <div>ID: {updatedTeam.id}</div>
        <label>Name: </label>
        <TextField onChange={e => setUpdatedTeam({...updatedTeam!, name: e.target.value})}
                   placeholder={updatedTeam.name}/>
        <br/>
        <Button variant="contained" onClick={onRemove}>Remove</Button>
        <Button variant="contained" onClick={update}>Save</Button>
        <Button variant="contained" onClick={() => setUpdatedTeam(null)}>Cancel</Button>
      </Box>
    </Modal>
  )
};

const BrowseTeams = () => {
  const [teams] = useTeams();
  const [, setRemovedTeam] = useRemovedTeam();
  const [, setUpdatedTeam] = useUpdatedTeam();
  const [remove] = useRemoveTeam();
  const [, setNewTeam] = useNewTeam();

  const onRemove = (team: Team) => {
    setRemovedTeam(team);
    remove();
  };

  const rows = (teams || []).map(t => ({
    id: t.id,
    name: t.name,
    edit: t,
    remove: t
  })) as GridRowsProp;

  const columns: GridColDef[] = [
    {field: "id", headerName: "ID"},
    {field: "name", headerName: "Name"},
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (p) => <Button variant="contained" onClick={() => setUpdatedTeam(p.value)}>Edit</Button>
    },
    {
      field: "remove",
      headerName: "Remove",
      renderCell: (p) => <Button variant="contained" onClick={() => onRemove(p.value)}>Remove</Button>
    },
  ];
  return (
    <>
      <Box display="flex" justifyContent="end" mb={1}>
        <Button variant="contained" onClick={() => setNewTeam({id: crypto.randomUUID(), name: ""})}>+ New Team</Button>
      </Box>
      <DataGrid rows={rows} columns={columns}/>
    </>
  );
};

const Teams = () => {
  return (
    <>
      <h3>TEAMS</h3>
      <BrowseTeams/>
      <AddTeam/>
      <EditTeam/>
    </>

  );
};

const Users = () => {
  return (
    <>
      <h3>USERS</h3>
      <Browse/>
      <Add/>
      <Edit/>
    </>
  );
};

const AddTask = () => {
  const [newTask, setNewTask] = useNewTask();
  const [addTask] = useAddTask();
  const [users] = useUsers();

  if (!newTask) {
    return <></>;
  }

  const onOwnerSelect = (e: SelectChangeEvent<unknown>) => {
    const ownerId = users?.find(u => u.id === e.target.value)?.id;
    setNewTask({...newTask, ownerId});
  };

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <Box>Tasks</Box>
        <Typography variant="h5">Tasks</Typography>
        <label>Name: </label>
        <TextField defaultValue={newTask?.name} onChange={e => setNewTask({...newTask, name: e.target.value})}/>
        <br/>
        <label>Status: </label>
        <TextField defaultValue={newTask?.status} onChange={e => setNewTask({...newTask, status: e.target.value})}/>
        <br/>
        <label>Owner: </label>
        <Select onChange={e => onOwnerSelect(e)} value={newTask.ownerId}>
          {users?.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
        </Select>
        <br/>
        <Button variant="contained" onClick={addTask}>Save</Button>
        <Button variant="contained" onClick={() => setNewTask(null)}>Cancel</Button>
      </Box>
    </Modal>
  );
};

const EditTask = () => {
  const [updatedTask, setUpdatedTask] = useUpdatedTask();
  const [, setRemovedTask] = useRemovedTask();
  const [update] = useUpdateTask();
  const [remove] = useRemoveTask();
  const [users] = useUsers();

  if (!updatedTask) {
    return <></>
  }

  const onOwnerSelect = (e: SelectChangeEvent<unknown>) => {
    const ownerId = users?.find(u => u.id === e.target.value)?.id;
    setUpdatedTask({...updatedTask, ownerId})
  };

  const onRemove = () => {
    setRemovedTask(updatedTask);
    remove();
  };

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <h3>Edit</h3>
        <div>ID: {updatedTask.id}</div>
        <label>Name: </label>
        <TextField onChange={e => setUpdatedTask({...updatedTask!, name: e.target.value})}
                   placeholder={updatedTask.name}/>
        <br/>
        <label>Status: </label>
        <TextField onChange={e => setUpdatedTask({...updatedTask!, status: e.target.value})}
                   placeholder={updatedTask.status}/>
        <br/>
        <label>Owner: </label>
        <Select onChange={e => onOwnerSelect(e)} value={updatedTask.ownerId}>
          {users?.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
        </Select>
        <br/>
        <Button variant="contained" onClick={onRemove}>Remove</Button>
        <Button variant="contained" onClick={update}>Save</Button>
        <Button variant="contained" onClick={() => setUpdatedTask(null)}>Cancel</Button>
      </Box>
    </Modal>
  )
};

const BrowseTasks = () => {
  const [tasks] = useTasks();
  const [users] = useUsers();
  const [teams] = useTeams();
  const [, setUpdatedTask] = useUpdatedTask();
  const [, setRemovedTask] = useRemovedTask();
  const [remove] = useRemoveTask();
  const [, setNewTask] = useNewTask();

  const onRemove = (task: Task) => {
    setRemovedTask(task);
    remove();
  };

  const rows = (tasks || []).map(t => {
    const owner = users?.find(u => u.id === t.ownerId);
    const team = teams?.find(t => t.id === owner?.teamId);
    return ({
      id: t.id,
      name: t.name,
      owner: owner?.name,
      team: team?.name,
      status: t.status,
      edit: t,
      remove: t
    });
  }) as GridRowsProp;

  const columns: GridColDef[] = [
    {field: "id", headerName: "ID"},
    {field: "name", headerName: "Name"},
    {field: "owner", headerName: "Owner"},
    {field: "team", headerName: "Team"},
    {field: "status", headerName: "Status"},
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (p) => <Button variant="contained" onClick={() => setUpdatedTask(p.value)}>Edit</Button>
    },
    {
      field: "remove",
      headerName: "Remove",
      renderCell: (p) => <Button variant="contained" onClick={() => onRemove(p.value)}>Remove</Button>
    },
  ];

  return (
    <>
      <h3>TASKS</h3>
      <Box height={800}>
        <Box display="flex" justifyContent="end" mb={1}>
          <Button variant="contained" onClick={() => setNewTask({id: crypto.randomUUID(), name: "", status: "To Do"})}>+ New Task</Button>
        </Box>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </>
  );
}

const Tasks = () => {
  return (
    <>
      <BrowseTasks/>
      <AddTask/>
      <EditTask/>
    </>
  );
};

const UI = () => {
  const [tab, setTab] = useState("users");
  const theme = useTheme();
  const foo = `solid black ${theme.palette.grey}`

  return (
    <Dashboard>
      <AppBar>
        <Toolbar>
          {/*<IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>*/}
          {/*  <MenuIcon/>*/}
          {/*</IconButton>*/}
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            TASKS APP SHOWCASE
          </Typography>
          <Button onClick={() => setTab("users")}>USERS</Button>
          <Button onClick={() => setTab("teams")}>TEAMS</Button>
        </Toolbar>
      </AppBar>
      <Box mt={8}>
        <Box display="flex" justifyContent="space-evenly">
          <Box>
            <Tasks/>
          </Box>
          <Box pl={8} borderLeft={foo}>
            <Box display={tab === "users" ? "block" : "none"}>
              <Users/>
            </Box>
            <Box display={tab === "teams" ? "block" : "none"}>
              <Teams/>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dashboard>
  );
};

export default UI;

//Supabase