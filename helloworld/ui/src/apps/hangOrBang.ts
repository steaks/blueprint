import {hook, event, state, app} from "../rxreact";

export interface Match {
  readonly name: string;
  readonly age: number;
  readonly type?: string;
}

//state
export const useAllMatches = state<Match[]>("hangOrBang", "allMatches");
export const usePotentialMatches = state<Match[]>("hangOrBang", "potentialMatches");

//events
export const useMyEvent = event("hangOrBang", "myEvent");

//hooks
export const useMyHook = hook<string>("hangOrBang", "myHook");

//App
export const HangOrBang = app("hangOrBang")