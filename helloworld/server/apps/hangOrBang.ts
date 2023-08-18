import {app, state, hook, event, operator, ref, set, get, trigger} from "@blueprint/rx";

const myHook = (myState: string) => {
  return `${myState} (this is from the hook!)`;
};


/*
* - Potential matches
* - Get all matches (need type)
* - Add match
* - Remove match
* - Update match (e.g. type)
* */

export interface Match {
  readonly name: string;
  readonly age: number;
  readonly type?: string;
}

const hangOrBang$$ = app(() => {

  const initMatches = [
    {
      name: "Steven",
      age: 33,
      type: 'hang'
    }
  ]

  const potentialMatches = [
    {
      name: "Matt",
      age: 36
    },
    {
      name: "Caleb",
      age: 28
    },
    {
      name: "Harry",
      age: 31
    },
  ]

  const allMatches$ = state<Match[]>("allMatches", initMatches);
  const potentialMatches$ = state<Match[]>("potentialMatches", potentialMatches);

  const myEvent$ = event("myEvent");

  const myHook$ = hook(
    operator(myHook, allMatches$)
  );

  return {
    name: "hangOrBang",
    state: [allMatches$, potentialMatches$],
    events: [myEvent$],
    hooks: [myHook$]
  }
});

export default hangOrBang$$;