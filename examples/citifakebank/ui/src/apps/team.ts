import {state, event, task, app} from "../rxreact";

//state
export const useSearch =  state<string>("team", "search");
export const useNewEmployee = state<string>("team", "newEmployee");
export const useExistingEmployee = state<string>("team", "existingEmployee");
export const useSelectedEmployee = state<string>("team", "selectedEmployee");
export const useUpdatedEmployee = state<string>("team", "updatedEmployee");

//events
export const useEmployeesChanged = event("team", "employeesChanged");

//tasks
export const useEmployees = task<string[]>("team", "employees");
export const useCount = task<number>("team", "count");
export const useAdd = task<null>("team", "add");
export const useRemove = task<null>("team", "remove");
export const useUpdate = task<null>("team", "update");

//App
export const Team = app("team")