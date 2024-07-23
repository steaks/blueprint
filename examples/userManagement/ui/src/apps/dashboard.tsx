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
} from "@mui/material";
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";

//users
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
const useRemovedTask = state<Task>("dashboard", "removedTask");
const useUpdatedTask = state<Task | null>("dashboard", "updatedTask");
const useAddTask = effect<null>("dashboard", "addTask");
const useRemoveTask = effect<null>("dashboard", "removeTask");
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


const BrowseUsers = () => {
  const [users] = useUsers();
  const [teams] = useTeams();
  const [, setUpdatedUser] = useUpdatedUser();
  const [, setRemovedUser] = useRemovedUser();
  const [remove] = useRemove();
  const [, setNewUser] = useNewUser();
  const defaultTeamId = teams ? teams[0].id : undefined;

  const onRemove = (user: User) => {
    setRemovedUser(user);
    remove();
  };

  const rows = (users || []).map(u => ({...u, edit: u, remove: u}));
  const columns: GridColDef[] = [
    {field: "id", headerName: "ID"},
    {field: "name", headerName: "Name"},
    {field: "teamName", headerName: "Team"},
    {field: "edit", headerName: "Edit", renderCell: (p) => <Button variant="contained" onClick={() => setUpdatedUser(p.value)}>Edit</Button>},
    {field: "remove", headerName: "Remove", renderCell: (p) => <Button variant="contained" onClick={() => onRemove(p.value)}>Remove</Button>},
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

const AddUser = () => {
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
        <Typography variant="h2">New User</Typography>
        <Box mt={1}>
          <InputLabel>Name</InputLabel>
          <TextField defaultValue={newUser?.name} onChange={e => setNewUser({...newUser, name: e.target.value})}/>
        </Box>
        <Box mt={1}>
          <InputLabel>Team</InputLabel>
          <Select onChange={e => onTeamSelect(e)} value={newUser?.teamId} sx={{minWidth: 250}}>
            {teams?.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
          </Select>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => setNewUser(null)}>Cancel</Button>
          &nbsp;
          <Button variant="contained" onClick={add}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

const EditUser = () => {
  const [updatedUser, setUpdatedUser] = useUpdatedUser();
  const [update] = useUpdate();
  const [teams] = useTeams();

  if (!updatedUser) {
    return <></>
  }

  const onTeamSelect = (e: SelectChangeEvent) => {
    const teamId = teams?.find(t => t.id === e.target.value)?.id;
    setUpdatedUser({...updatedUser, teamId});
  };

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <Typography variant="h2">Edit User</Typography>
        <Box mt={1}>
          <InputLabel>Name: </InputLabel>
          <TextField onChange={e => setUpdatedUser({...updatedUser!, name: e.target.value})} placeholder={updatedUser.name}/>
        </Box>
        <Box mt={1}>
          <InputLabel>Team: </InputLabel>
          <Select onChange={e => onTeamSelect(e)} value={updatedUser.teamId} sx={{minWidth: 250}}>
            {teams?.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
          </Select>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => setUpdatedUser(null)}>Cancel</Button>
          &nbsp;
          <Button variant="contained" onClick={update}>Save</Button>
        </Box>
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
        <Typography variant="h2">New Team</Typography>
        <Box mt={1}>
          <InputLabel>Name: </InputLabel>
          <TextField defaultValue={newTeam?.name} onChange={e => setNewTeam({...newTeam!, name: e.target.value})}/>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => setNewTeam(null)}>Cancel</Button>
          &nbsp;
          <Button variant="contained" onClick={addTeam}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

const EditTeam = () => {
  const [updatedTeam, setUpdatedTeam] = useUpdatedTeam();
  const [update] = useUpdateTeam();

  if (!updatedTeam) {
    return <></>
  }

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <Typography variant="h2">Edit User</Typography>
        <Box mt={1}>
          <InputLabel>Name: </InputLabel>
          <TextField onChange={e => setUpdatedTeam({...updatedTeam!, name: e.target.value})}
                     placeholder={updatedTeam.name}/>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => setUpdatedTeam(null)}>Cancel</Button>
          &nbsp;
          <Button variant="contained" onClick={update}>Save</Button>
        </Box>
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

  const rows = (teams || []).map(t => ({...t, edit: t, remove: t}));

  const columns: GridColDef[] = [
    {field: "id", headerName: "ID"},
    {field: "name", headerName: "Name"},
    {field: "edit", headerName: "Edit", renderCell: (p) => <Button variant="contained" onClick={() => setUpdatedTeam(p.value)}>Edit</Button>},
    {field: "remove", headerName: "Remove", renderCell: (p) => <Button variant="contained" onClick={() => onRemove(p.value)}>Remove</Button>},
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
      <Box mt={2} typography="h2">Teams</Box>
      <BrowseTeams/>
      <AddTeam/>
      <EditTeam/>
    </>

  );
};

const Users = () => {
  return (
    <>
      <Box mt={2} typography="h2">Users</Box>
      <BrowseUsers/>
      <AddUser/>
      <EditUser/>
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
        <Typography variant="h2">New Task</Typography>
        <Box mt={1}>
          <InputLabel>Name: </InputLabel>
          <TextField defaultValue={newTask?.name} onChange={e => setNewTask({...newTask, name: e.target.value})}/>
        </Box>
        <Box mt={1}>
          <InputLabel>Status: </InputLabel>
          <TextField defaultValue={newTask?.status} onChange={e => setNewTask({...newTask, status: e.target.value})}/>
        </Box>
        <Box mt={1}>
          <InputLabel>Owner: </InputLabel>
          <Select onChange={e => onOwnerSelect(e)} value={newTask.ownerId} sx={{minWidth: 250}}>
            {users?.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
          </Select>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => setNewTask(null)}>Cancel</Button>
          &nbsp;
          <Button variant="contained" onClick={addTask}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

const EditTask = () => {
  const [updatedTask, setUpdatedTask] = useUpdatedTask();
  const [update] = useUpdateTask();
  const [users] = useUsers();

  if (!updatedTask) {
    return <></>
  }

  const onOwnerSelect = (e: SelectChangeEvent<unknown>) => {
    const ownerId = users?.find(u => u.id === e.target.value)?.id;
    setUpdatedTask({...updatedTask, ownerId})
  };

  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <Typography variant="h2">Edit Task</Typography>
        <Box mt={1}>
          <InputLabel>Name:</InputLabel>
          <TextField onChange={e => setUpdatedTask({...updatedTask!, name: e.target.value})} placeholder={updatedTask.name}/>
        </Box>
        <Box mt={1}>
          <InputLabel>Status:</InputLabel>
          <TextField onChange={e => setUpdatedTask({...updatedTask!, status: e.target.value})} placeholder={updatedTask.status}/>
        </Box>
        <Box mt={1}>
          <InputLabel>Owner:</InputLabel>
          <Select onChange={e => onOwnerSelect(e)} value={updatedTask.ownerId} sx={{minWidth: 250}}>
            {users?.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
          </Select>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => setUpdatedTask(null)}>Cancel</Button>
          &nbsp;
          <Button variant="contained" onClick={update}>Save</Button>
        </Box>
      </Box>
    </Modal>
  )
};

const BrowseTasks = () => {
  const [tasks] = useTasks();
  const [, setUpdatedTask] = useUpdatedTask();
  const [, setRemovedTask] = useRemovedTask();
  const [remove] = useRemoveTask();
  const [, setNewTask] = useNewTask();

  const onRemove = (task: Task) => {
    setRemovedTask(task);
    remove();
  };

  const rows = (tasks || []).map(t => ({...t, edit: t, remove: t}));
  const columns: GridColDef[] = [
    {field: "id", headerName: "ID"},
    {field: "name", headerName: "Name", width: 200},
    {field: "ownerName", headerName: "Owner"},
    {field: "teamName", headerName: "Team"},
    {field: "status", headerName: "Status"},
    {field: "edit", headerName: "Edit", renderCell: (p) => <Button variant="contained" onClick={() => setUpdatedTask(p.value)}>Edit</Button>},
    {field: "remove", headerName: "Remove", renderCell: (p) => <Button variant="contained" onClick={() => onRemove(p.value)}>Remove</Button>},
  ];

  return (
    <>
      <Box mt={2} typography="h2">Tasks</Box>
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

  return (
    <Dashboard>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            TASKS APPLICATION
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
          <Box pl={8}>
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