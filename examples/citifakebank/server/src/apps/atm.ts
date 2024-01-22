import {app, state, task, from, trigger} from "blueprint-server";
import session from "../session";
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

  const deposit$ = task(
    {name: "deposit", triggers: ["self"]},
    from(deposit, depositAmount$, session.state.username),
    trigger(session.events.newDeposits)
  );

  const withdraw$ = task(
    {name: "withdraw", triggers: ["self"]},
    from(withdraw, withdrawAmount$, session.state.username),
    trigger(session.events.newWithdrawals)
  );

  return {
    name: "atm",
    state: [depositAmount$, withdrawAmount$],
    events: [],
    tasks: [deposit$, withdraw$]
  };
});

export default atm$$;