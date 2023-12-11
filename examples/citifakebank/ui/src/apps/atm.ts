import {state, app, task} from "../rxreact";
//state
export const useDepositAmount = state<number>("atm", "depositAmount");
export const useWithdrawAmount = state<number>("atm", "withdrawAmount");

//events
export const useDeposit = task("atm", "deposit");
export const useWithdraw = task("atm", "withdraw");

//tasks

//App
export const Atm = app("atm");