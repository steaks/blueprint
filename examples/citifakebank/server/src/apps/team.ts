import {app, state, task, event, from, trigger} from "@blueprint/server";
import {db} from "../postgres";

const employees = async (search: string): Promise<string[]> =>
  await db.map<string>(`SELECT name FROM employees WHERE '${search}' != '' AND name LIKE '%${search}%'`, {search}, row => row.name);

const count = async (search: string): Promise<number> => {
    const cnt = await db.map<number>(`SELECT COUNT(*) AS cnt FROM employees WHERE '${search}' != '' AND name LIKE '%${search}%'`, [], row => row.cnt);
    return cnt[0];
};

const addEmployee = async (newEmployee: string): Promise<void> => {
    await db.none("INSERT INTO employees(name) VALUES(${newEmployee})", {newEmployee});
};

const removeEmployee = async (deleteEmployee: string): Promise<void> => {
    await db.none(`DELETE FROM employees WHERE name = '${deleteEmployee}'`, []);
};

const updateEmployee = async (selectedEmployee: string, updatedEmployee: string): Promise<void> => {
    console.log(selectedEmployee, updatedEmployee);
    await db.none(`UPDATE employees SET name = '${updatedEmployee}' WHERE name = '${selectedEmployee}'`, []);
    //TODO
    // await db.none(`DELETE FROM employees WHERE name = '${deleteEmployee}'`, []);
};

const team$$ = app(() => {
    const search$ = state<string>("search");
    const newEmployee$ = state<string>("newEmployee");
    const existingEmployee$= state<string>("existingEmployee");
    const selectedEmployee$ = state<string>("selectedEmployee");
    const updatedEmployee$ = state<string>("updatedEmployee");

    const employeesChanged$ = event("employeesChanged");

    const employees$ = task(
      {triggers: ["stateChanges", employeesChanged$]},
      from(employees, search$),
    );

    const count$ = task(
      {triggers: ["stateChanges", employeesChanged$]},
      from(count, search$),
    );

    const add$ = task(
      "add",
      {triggers: ["self"]},
      from(addEmployee, newEmployee$),
      trigger(employeesChanged$)
    );

    const remove$ = task(
      "remove",
      {triggers: ["self"]},
      from(removeEmployee, existingEmployee$),
      trigger(employeesChanged$)
    );

    const update$ = task(
      "update",
      {triggers: ["self"]},
      from(updateEmployee, selectedEmployee$, updatedEmployee$),
      trigger(employeesChanged$)
    );

    return {
        name: "team",
        state: [search$, newEmployee$, existingEmployee$, selectedEmployee$, updatedEmployee$],
        events: [employeesChanged$],
        tasks: [employees$, count$, add$, remove$, update$]
    };
});

export default team$$;

//POST http://localhost:8080/employees/search?body={search}
//POST http://localhost:8080/employees/newEmployee?body={newEmployee}
//POST http://localhost:8080/employees/add
//POST http://localhost:8080/employees/remove

//Webtask Events
//
//{name: "/employees/employees", string[]}
//{name: "/employees/count", number}

/*
- Build levels 1-4
- Relationship to datastores
- What is foreign vs. native (e.g. imports)
- Look into C4 diagraming
- Rendering embedded in vscode
- Support for expand/collapse of all the diagrams
 */