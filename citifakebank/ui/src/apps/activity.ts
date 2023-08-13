import {hook, app} from "@blueprint/rxreact";

interface Deposit {
  readonly amount: number;
}

interface Withdraw {
  readonly amount: number;
}

interface Fee {
  readonly amount: number;
}

//state

//events

//hooks
export const useDeposits = hook<Deposit[]>("activity", "deposits");
export const useWithdraws = hook<Withdraw[]>("activity", "withdraws");
export const useFees = hook<Fee[]>("activity", "fees");

//App
export const Activity = app("activity")