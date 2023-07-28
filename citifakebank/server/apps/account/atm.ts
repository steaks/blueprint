import rxblueprint from "../../rx-blueprint/rxblueprint";
import session from "../../session";
import activitydb from "./common";
const {app, state, hook, operator, trigger} = rxblueprint;
const deposit = (amount: number, username: string) => {
  Promise.resolve(activitydb.deposit(Number(amount), username));
};

const atm$$ = app(() => {
  const depositAmount$ = state<number>("depositAmount");

  const deposit$ = hook(
    "deposits",
    {runWhen: "onlytriggers", },
    operator(deposit, depositAmount$, session.state.username),
    trigger(session.events.newDeposits)
  );

  return {
    name: "atm",
    state: [depositAmount$, session.state.username],
    events: [session.events.newDeposits],
    hooks: [deposit$]
  };
});

export default atm$$;