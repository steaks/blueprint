import {hook, app} from "@blueprint/rxreact";
import {Deposit, Fee, Withdraw} from "../../../shared/src/common";

//state

//events

//hooks
export const useDeposits = hook<Deposit[]>("activity", "deposits");
export const useWithdraws = hook<Withdraw[]>("activity", "withdraws");
export const useFees = hook<Fee[]>("activity", "fees");

//App
export const Activity = app("activity")