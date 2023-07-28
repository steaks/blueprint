import {state, event, app} from "../rxblueprint-react-client";
//state
export const useDepositAmount = state<number>("atm", "depositAmount");

//events
export const useSendDeposit = event("atm", "sendDeposit");

//hooks

//App
export const Atm = app("atm");