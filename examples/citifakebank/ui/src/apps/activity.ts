import {task, app} from "../rxreact";
import {Deposit, Fee, Withdraw} from "../../../shared/src/common";

//state

//events

//tasks
export const useDeposits = task<Deposit[]>("activity", "deposits");
export const useWithdraws = task<Withdraw[]>("activity", "withdraws");
export const useFees = task<Fee[]>("activity", "fees");

//App
export const Activity = app("activity")