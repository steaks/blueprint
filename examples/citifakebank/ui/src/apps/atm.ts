import {state, app, hook} from "../rxreact";
//state
export const useDepositAmount = state<number>("atm", "depositAmount");
export const useWithdrawAmount = state<number>("atm", "withdrawAmount");

//events
export const useDeposit = hook("atm", "deposit");
export const useWithdraw = hook("atm", "withdraw");

//hooks

//App
export const Atm = app("atm");