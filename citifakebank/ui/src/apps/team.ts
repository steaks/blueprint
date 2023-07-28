import {state, event, hook, app} from "../rxblueprint-react-client";

//state
export const useSearch =  state<string>("team", "search");
export const useNewEmployee = state<string>("team", "newEmployee");
export const useExistingEmployee = state<string>("team", "existingEmployee");
export const useSelectedEmployee = state<string>("team", "selectedEmployee");
export const useUpdatedEmployee = state<string>("team", "updatedEmployee");

//events
export const useEmployeesChanged = event("team", "employeesChanged");

//hooks
export const useEmployees = hook<string[]>("team", "employees");
export const useCount = hook<number>("team", "count");
export const useAdd = hook<null>("team", "add");
export const useRemove = hook<null>("team", "remove");
export const useUpdate = hook<null>("team", "update");

//App
export const Team = app("team")