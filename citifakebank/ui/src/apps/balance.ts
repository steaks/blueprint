import blueprint from "@blueprint/rxreact";
const {hook, app} = blueprint;

//state

//events

//hooks
export const useBalance = hook<string>("balance", "balance");

//App
export const Balance = app("balance")