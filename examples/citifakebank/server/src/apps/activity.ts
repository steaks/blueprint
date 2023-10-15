import {app, hook, operator} from "@blueprint/server";
import activitydb from "./common";
import session from "../session";

const deposits = async (username: string) =>
  await activitydb.deposits(username);

const withdraws = async (username: string) =>
  await activitydb.withdraws(username);

const fees = async (username: string) =>
  await activitydb.fees(username);


const activity$$ = app(() => {
  const deposits$ = hook(
    {triggers: ["stateChanges", session.events.newDeposits]},
    operator(deposits, session.state.username),
  );

  const withdraws$ = hook(
    {triggers: ["stateChanges", session.events.newWithdrawals]},
    operator(withdraws, session.state.username),
  );

  const fees$ = hook(
    operator(fees, session.state.username),
  );

  return {
    name: "activity",
    state: [],
    events: [],
    hooks: [deposits$, withdraws$, fees$]
  };
});

export default activity$$;