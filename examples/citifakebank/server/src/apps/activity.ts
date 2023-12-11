import {app, task, from} from "@blueprint/server";
import activitydb from "./common";
import session from "../session";

const deposits = async (username: string) =>
  await activitydb.deposits(username);

const withdraws = async (username: string) =>
  await activitydb.withdraws(username);

const fees = async (username: string) =>
  await activitydb.fees(username);


const activity$$ = app(() => {
  const deposits$ = task(
    {name: "activity", triggers: ["stateChanges", session.events.newDeposits]},
    from(deposits, session.state.username),
  );

  const withdraws$ = task(
    {name: "withdraws", triggers: ["stateChanges", session.events.newWithdrawals]},
    from(withdraws, session.state.username),
  );

  const fees$ = task(
    from(fees, session.state.username),
  );

  return {
    name: "activity",
    state: [],
    events: [],
    tasks: [deposits$, withdraws$, fees$]
  };
});

export default activity$$;