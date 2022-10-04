import webserver, {BResponse, WithQuery} from "../../index";
import authentication, {WithUser} from "./authentication";
import activity, {Deposit,Fee,Withdraw} from "./activity";
import blueprint, {With1,With2,With3,With4} from "blueprint";

const getDeposits = async (request: WithUser) =>
  await activity.deposits(request.user.username);

const getWithdraws = async (p: unknown, context: With1<WithUser>) =>
  await activity.withdraws(context[0].user.username);

const getFees = async (p: unknown, context: With2<WithUser>) =>
  await activity.fees(context[0].user.username);

const toActivityHTML = (p: unknown, context: With3<WithUser, Deposit[], Withdraw[], Fee[]>): BResponse => {
  const req = context[0];
  const deposits = context[1];
  const withdraws = context[2];
  const fees = context[3];
  const data = `
    <div><h2>Deposits</h2>${deposits.map(d => `<div>${d.amount}</div>`).join("")}</div>
    <div><h2>Withdraws</h2>${withdraws.map(w => `<div>${w.amount}</div>`).join("")}</div>
    <div><h2>Fees</h2>${fees.map(f => `<div>${f.amount}</div>`).join("")}</div>
  `;
  return {
    ...req,
    statusCode: 200,
    data
  };
};

const calculate = (p: unknown, context: With3<unknown, Deposit[], Withdraw[], Fee[]>): number => {
  const deposits = context[1];
  const withdraws = context[2];
  const fees = context[3];
  const depositsSum = deposits.reduce((sum, a) => sum + a.amount, 0);
  const withdrawsSum = withdraws.reduce((sum, a) => sum + a.amount, 0);
  const feesSum = fees.reduce((sum, a) => sum + a.amount, 0);
  return depositsSum - withdrawsSum - feesSum;
};

const toBalanceHTML = (p: number, context: With4<WithUser>): BResponse => {
  const req = context[0];
  const data = `<div><h2>Balance</h2>${p}</div>`;
  return {
    ...req,
    statusCode: 200,
    data
  };
};

export const getActivity = blueprint.graph("/activity",
  blueprint.operator.operator(getDeposits),
  blueprint.operator.operator(getWithdraws),
  blueprint.operator.operator(getFees),
  blueprint.operator.operator(toActivityHTML),
  "activity"
);

export const getBalance = blueprint.graph("/balance",
  blueprint.operator.operator(getDeposits),
  blueprint.operator.operator(getWithdraws),
  blueprint.operator.operator(getFees),
  blueprint.operator.operator(calculate),
  blueprint.operator.operator(toBalanceHTML),
  "balance"
);

const account = webserver.router.router<WithQuery, WithUser>("/account")
  .before(authentication.authenticate)
  .get("/balance", getBalance)
  .get("/activity", getActivity)
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

export default account;
