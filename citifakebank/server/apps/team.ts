import rxblueprint from "../rx-blueprint/rxblueprint";
import {db} from "../postgres";
const {app, state, hook, event, operator, trigger} = rxblueprint;

const employees = async (search: string): Promise<string[]> =>
  await db.map<string>(`SELECT name FROM employees WHERE name LIKE '%${search}%'`, {search}, row => row.name);

const count = async (search: string): Promise<number> => {
    const cnt = await db.map<number>(`SELECT COUNT(*) AS cnt FROM employees WHERE name LIKE '%${search}%'`, [], row => row.cnt);
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

    const employees$ = hook(
      {triggers: [employeesChanged$]},
      operator(employees, search$),
    );

    const count$ = hook(
      {triggers: [employeesChanged$]},
      operator(count, search$),
    );

    const add$ = hook(
      "add",
      {runWhen: "onlytriggers", manualTrigger: true},
      operator(addEmployee, newEmployee$),
      trigger(employeesChanged$)
    );

    const remove$ = hook(
      "remove",
      {runWhen: "onlytriggers", manualTrigger: true},
      operator(removeEmployee, existingEmployee$),
      trigger(employeesChanged$)
    );

    const update$ = hook(
      "update",
      {runWhen: "onlytriggers", manualTrigger: true},
      operator(updateEmployee, selectedEmployee$, updatedEmployee$),
      trigger(employeesChanged$)
    );

    return {
        name: "team",
        state: [search$, newEmployee$, existingEmployee$, selectedEmployee$, updatedEmployee$],
        events: [employeesChanged$],
        hooks: [employees$, count$, add$, remove$, update$]
    };
});

export default team$$;

//POST http://localhost:8080/employees/search?body={search}
//POST http://localhost:8080/employees/newEmployee?body={newEmployee}
//POST http://localhost:8080/employees/add
//POST http://localhost:8080/employees/remove

//Webhook Events
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