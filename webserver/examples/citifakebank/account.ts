import webserver, {BResponse, WithQuery} from "../../index";
import authentication, {WithUser} from "./authentication";
import activity ,{Deposit,Fee,Withdraw}from "./activity";
import blueprint from "blueprint";

interface WithDeposits {
  readonly req: WithUser;
  readonly deposits: Deposit[];
}

type WithWithdraws = WithDeposits & {
  readonly withdraws: Withdraw[];
}

type WithFees = WithWithdraws & {
  readonly fees: Fee[];
}

type WithBalance = WithFees & {
  readonly balance: number;
}

const getDeposits = async (req: WithUser) => {
  const deposits = await activity.deposits(req.user.username);
  return {deposits, req};
};

const getWithdraws = async (p: WithDeposits) => {
 const withdraws = await activity.withdraws(p.req.user.username);
 return {...p, withdraws};
};

const getFees = async (p: WithWithdraws) => {
  const fees = await activity.fees(p.req.user.username);
  return {...p, fees};
};

const toActivityHTML = (p: WithFees): BResponse => {
  const data = `
    <div><h2>Deposits</h2>${p.deposits.map(d => `<div>${d.amount}</div>`).join("")}</div>
    <div><h2>Withdraws</h2>${p.withdraws.map(w => `<div>${w.amount}</div>`).join("")}</div>
    <div><h2>Fees</h2>${p.fees.map(f => `<div>${f.amount}</div>`).join("")}</div>
  `;
  return {
    ...p.req,
    statusCode: 200,
    data
  };
};

const calculate = (p: WithFees): WithBalance => {
  const deposits = p.deposits.reduce((sum, a) => sum + a.amount, 0);
  const withdraws = p.withdraws.reduce((sum, a) => sum + a.amount, 0);
  const fees = p.fees.reduce((sum, a) => sum + a.amount, 0);
  const balance = deposits - withdraws - fees;
  return {...p, balance};
};

const toBalanceHTML = (p: WithBalance): BResponse => {
  const data = `<div><h2>Balance</h2>${p.balance}</div>`;
  return {
    ...p.req,
    statusCode: 200,
    data
  };
};

export const getActivity = blueprint.graph("/activity",
  blueprint.operator.operator(getDeposits),
  blueprint.operator.operator(getWithdraws),
  blueprint.operator.operator(getFees),
  blueprint.operator.operator(toActivityHTML)
);

export const getBalance = blueprint.graph("/balance",
  blueprint.operator.operator(getDeposits),
  blueprint.operator.operator(getWithdraws),
  blueprint.operator.operator(getFees),
  blueprint.operator.operator(calculate),
  blueprint.operator.operator(toBalanceHTML)
);

const account = webserver.router.router<WithQuery, WithUser>("/account")
  .before(authentication.authenticate)
  .get("/balance", getBalance)
  .get("/activity", getActivity)
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

export default account;
