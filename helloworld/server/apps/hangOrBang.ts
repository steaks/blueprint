import {app, state, hook, event, operator, ref, set, get, trigger} from "@blueprint/rx";
import {v4 as uuidv4} from 'uuid';

/*
* - Potential matches
* - Get all matches (need type)
* - Add match
* - Remove match
* - Update match (e.g. type)
* */

type UUIDV4 = string;
export interface Match {
  readonly id: UUIDV4;
  readonly name: string;
  readonly age: number;
  readonly hang: boolean;
  readonly bang: boolean;
}

const generatePotentialMatches = () => {
  const names = ["Glenn", "Paul", "Bradley", "Sean", "Drew"];
  const minAge = 25;
  const maxAge = 40;
  return names.map(name => {
    const age = Math.floor(Math.random() * ((maxAge - minAge) + 1) + minAge);
    return {id: uuidv4(), name, age, hang: false, bang: false};
  });
};

const hangOrBang$$ = app(() => {

  const initMatches = [
    {
      id: "bd0024d6-32f1-4e21-8192-1db7bedd0a45",
      name: "Steven",
      age: 34,
      hang: true,
      bang: true
    }
  ]

  const potentialMatches = [
    {
      id: "c720a4e4-c777-49b4-8b31-d0a52c77b387",
      name: "Matt",
      age: 36,
      hang: false,
      bang: false
    },
    {
      id: "77d3b827-a789-4995-b018-e11f68e4ad56",
      name: "Caleb",
      age: 28,
      hang: false,
      bang: false
    },
    {
      id: "36f77485-d4f7-4fab-961e-1890e54a81a9",
      name: "Harry",
      age: 31,
      hang: false,
      bang: false
    },
  ]

  const allMatches$ = state<Match[]>("allMatches", initMatches);
  const potentialMatches$ = state<Match[]>("potentialMatches", potentialMatches);

  const myEvent$ = event("myEvent");

  const createPotentialMatchesOperator = operator(generatePotentialMatches, potentialMatches$);
  const getPotentialMatches$ = hook(
    "getPotentialMatches",
    {
      manualTrigger: true,
      runWhen: "onlytriggers"
    },
    createPotentialMatchesOperator,
    set(potentialMatches$, createPotentialMatchesOperator)
  );

  return {
    name: "hangOrBang",
    state: [allMatches$, potentialMatches$],
    events: [myEvent$],
    hooks: [getPotentialMatches$]
  }
});

export default hangOrBang$$;