import React from "react";
import {
  Team,
  useAdd,
  useCount,
  useEmployees,
  useExistingEmployee,
  useNewEmployee,
  useRemove,
  useSearch,
  useSelectedEmployee,
  useUpdate,
  useUpdatedEmployee
} from "../apps/team";

const UI = () => {
  const [search, setSearch] = useSearch();
  const [employees] = useEmployees();
  const [count] = useCount();
  const [selectedEmployee, setSelectedEmployee] = useSelectedEmployee();
  const [updatedEmployee, setUpdatedEmployee] = useUpdatedEmployee();
  const [, add] = useAdd();
  const [, remove] = useRemove();
  const [, update] = useUpdate();

  const [newEmployee, setNewEmployee] = useNewEmployee();
  const [existingEmployee, setExistingEmployee] = useExistingEmployee();

  const onSelect = (employee: string) => {
    setSelectedEmployee(employee);
    setUpdatedEmployee(employee);
  };


  return (
    <Team>
      <div>
        <a href="http://localhost:3000">Home</a>
        <div>Search:</div>
        <input defaultValue={search} onChange={e => setSearch(e.currentTarget.value)} />
        <div>Employees ({count || 0}): </div>
        <ul>{(employees || []).map(e => <li key={e} onClick={() => onSelect(e)}>{e}</li>)}</ul>
        <hr />
        <div>Add New Employee</div>
        <input defaultValue={newEmployee} onChange={e => setNewEmployee(e.currentTarget.value)} />
        <button onClick={add}>Add</button>
        <hr/>
        <div>Remove Employee</div>
        <input defaultValue={existingEmployee} onChange={e => setExistingEmployee(e.currentTarget.value)}/>
        <button onClick={remove}>Remove</button>
        <hr/>
        <div>Edit Employee</div>
        <div>Editing: {selectedEmployee}</div>
        <input value={updatedEmployee} onChange={e => setUpdatedEmployee(e.currentTarget.value)} />
        <button onClick={update}>Update</button>
      </div>
    </Team>
  );
};

export default UI;