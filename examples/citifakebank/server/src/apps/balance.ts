import {app, from, task} from "@blueprint/server";
import activitydb from "./common";
import _ from "lodash";
import session from "../session";
import {Deposit, Fee, Withdraw} from "../../../shared/src/common";

const deposits = async (username: string) =>
  await activitydb.deposits(username);

const withdraws = async (username: string) => await activitydb.withdraws(username);

const fees = async (username: string) =>
  await activitydb.fees(username);

const balance = async (deposits: Deposit[], withdraws: Withdraw[], fees: Fee[]) =>
  Promise.resolve(_.sumBy(deposits, d => d.amount) - _.sumBy(withdraws, w => w.amount) - _.sumBy(fees, f => f.amount));

const balance$$ = app(() => {
  const deposits$ = task(
    {name: "deposits", triggers: ["stateChanges", session.events.newDeposits]},
    from(deposits, session.state.username)
  );

  const withdraws$ = task(
    {name: "withdraws", triggers: ["stateChanges", session.events.newWithdrawals]},
    from(withdraws, session.state.username)
  );

  const fees$ = task(
    from(fees, session.state.username)
  );

  const balance$ = task(
    from(balance, deposits$, withdraws$, fees$)
  );

  return {
    name: "balance",
    state: [],
    events: [],
    tasks: [deposits$, withdraws$, fees$, balance$]
  };
});

export default balance$$;