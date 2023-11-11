import React, {useCallback, useEffect, useState} from "react";
import {useEmployees} from "../citifakebank/ui/src/apps/team";

interface Employee {

}

const get = async <T, >(uri: string): Promise<T> => {
  const response = await fetch(uri);
  return await response.json();
};

const post = async <T, >(uri: string): Promise<T> => {
  const response = await fetch(uri, {method: "POST"});
  return await response.json();
};

const UI = () => {
  const [search, setSearch] = useState<"">();
  const [employees, setEmployees] = useState<Employee[]>();
  const [count, setCount] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [updatedEmployee, setUpdatedEmployee] = useState("");
  const [newEmployee, setNewEmployee] = useState<Employee>();
  const [existingEmployee, setExistingEmployee] = useState<Employee>();

  const onSelect = (employee: string) => {
    setSelectedEmployee(employee);
    setUpdatedEmployee(employee);
  };

  const loadEmployees = useCallback(() => {
    get<Employee[]>(`/search?search=${search}`).then(setEmployees);
    get<number>(`/count?search=${search}`).then(setCount);
  });

  const onSearchChange = useCallback((search: string) => {
    setSearch(search);
    loadEmployees();
  });

  const add = useCallback(() => {
    post(`/newEmployee?newEmployee=${newEmployee}`).then(loadEmployees);
  });

  const remove = useCallback(() => {
    post(`/removeEmployee?existingEmployee=${existingEmployee}`).then(loadEmployees);
  });

  const update = useCallback(() => {
    post(`/updateEmployee?existingEmployee=${existingEmployee}`).then(loadEmployees);
  });

  return (
    <div>
      <div>
        <a href="http://localhost:3000">Home</a>
        <div>Search:</div>
        <input onChange={e => onSearchChange(e.currentTarget.value)} />
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
    </div>
  );
};

export default UI;