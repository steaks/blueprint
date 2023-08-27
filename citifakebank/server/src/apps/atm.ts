import {app, state, hook, operator, trigger} from "@blueprint/rx";
import session from "../../session";
import activitydb from "./common";
const deposit = (amount: number, username: string) => {
  Promise.resolve(activitydb.deposit(Number(amount), username));
};

const withdraw = (amount: number, username: string) => {
  Promise.resolve(activitydb.withdraw(Number(amount), username));
};

const atm$$ = app(() => {
  const depositAmount$ = state<number>("depositAmount");
  const withdrawAmount$ = state<number>("withdrawAmount");

  const deposit$ = hook(
    "deposit",
    {runWhen: "onlytriggers", manualTrigger: true},
    operator(deposit, depositAmount$, session.state.username),
    trigger(session.events.newDeposits)
  );

  const withdraw$ = hook(
    "withdraw",
    {runWhen: "onlytriggers", manualTrigger: true},
    operator(withdraw, withdrawAmount$, session.state.username),
    trigger(session.events.newWithdrawals)
  );

  return {
    name: "atm",
    state: [depositAmount$, withdrawAmount$],
    events: [],
    hooks: [deposit$, withdraw$]
  };
});

export default atm$$;