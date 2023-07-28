import rxblueprint from "../../rx-blueprint/rxblueprint";
import activitydb, {Deposit, Fee, Withdraw} from "./common";
import _ from "lodash";
import session from "../../session";
const {app, operator, hook} = rxblueprint;

const deposits = async (username: string) =>
  await activitydb.deposits(username);

const withdraws = async (username: string) =>
  await activitydb.withdraws(username);

const fees = async (username: string) =>
  await activitydb.fees(username);

const calculate = async (deposits: Deposit[], withdraws: Withdraw[], fees: Fee[]) =>
  Promise.resolve(_.sumBy(deposits, d => d.amount) + _.sumBy(withdraws, w => w.amount) - _.sumBy(fees, f => f.amount));

const balance$$ = app(() => {
  const deposits$ = operator(deposits, session.state.username);
  const withdraws$ = operator(withdraws, session.state.username);
  const fees$ = operator(fees, session.state.username);
  const calculate$ = operator(calculate, deposits$, withdraws$, fees$);

  const balance$ = hook(
    "balance",
    {triggers: [session.events.newDeposits]},
    deposits$,
    withdraws$,
    fees$,
    calculate$
  );

  return {
    name: "balance",
    state: [session.state.username],
    events: [session.events.newDeposits],
    hooks: [balance$]
  };
});

export default balance$$;