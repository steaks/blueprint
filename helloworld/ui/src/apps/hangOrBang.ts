import {hook, event, state, app} from "../rxreact";

type UUIDV4 = string;
export interface Match {
  readonly id: UUIDV4;
  readonly name: string;
  readonly age: number;
  readonly hang: boolean;
  readonly bang: boolean;
}

//state
export const useAllMatches = state<Match[]>("hangOrBang", "allMatches");
export const usePotentialMatches = state<Match[]>("hangOrBang", "potentialMatches");

//events
export const useMyEvent = event("hangOrBang", "myEvent");

//hooks
export const useGetPotentialMatches = hook<void>("hangOrBang", "getPotentialMatches");

//App
export const HangOrBang = app("hangOrBang")