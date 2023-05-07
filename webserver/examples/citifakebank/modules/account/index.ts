import webserver, {BRequest, BResponse} from "../../../../index";
import authentication, {WithUser} from "../../middleware/authentication";
import blueprint from "blueprint";
import activity, {Deposit, Fee, Withdraw} from "./activity";
import {notFound} from "../common";

const getDeposits = async (request: WithUser) =>
  await activity.deposits(request.user.username);

const getWithdraws = async (request: WithUser) =>
  await activity.withdraws(request.user.username);

const getFees = async (request: WithUser) =>
  await activity.fees(request.user.username);

const toActivityHTML = (req: WithUser, deposits: Deposit[], withdraws: Withdraw[], fees: Fee[]): BResponse => {
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

const calculate = (deposits: Deposit[], withdraws: Withdraw[], fees: Fee[]): number => {
  const depositsSum = deposits.reduce((sum, a) => sum + a.amount, 0);
  const withdrawsSum = withdraws.reduce((sum, a) => sum + a.amount, 0);
  const feesSum = fees.reduce((sum, a) => sum + a.amount, 0);
  return depositsSum - withdrawsSum - feesSum;
};

const toBalanceHTML = (p: number, req: WithUser): BResponse => {
  const data = `<div><h2>Balance</h2>${p}</div>`;
  return {
    ...req,
    statusCode: 200,
    data
  };
};

const balanceHTML = (request: WithUser, calculation: number): BResponse => {
  const data = `<div><h2>Balance</h2>${calculation}</div>`;
  return {
    ...request,
    statusCode: 200,
    data
  };
};

export const getActivity = (() => {
  const request = blueprint.input<WithUser>();
  const deposits = blueprint.operator(getDeposits, request);
  const withdraws = blueprint.operator(getWithdraws, request);
  const fees = blueprint.operator(getFees, request);
  const activity = blueprint.operator(toActivityHTML, request, deposits, withdraws, fees)
  return blueprint.graph("/activity",
      request,
      deposits,
      withdraws,
      fees,
      activity,
  );
})();


const getBalance = (() => {
  const request = blueprint.input<WithUser>();
  const deposits = blueprint.operator(getDeposits, request);
  const withdraws = blueprint.operator(getWithdraws, request);
  const fees = blueprint.operator(getFees, request);
  const calculation = blueprint.operator(calculate, deposits, withdraws, fees);
  const balance = blueprint.operator(balanceHTML, request, calculation);
  return blueprint.graph("/balance",
    request,
    deposits,
    withdraws,
    fees,
    calculation,
    balance
  );

})();


export default webserver.routes<BRequest, WithUser>("/account")
  .before(authentication.authenticate)
  .get("/balance", getBalance)
  .get("/activity", getActivity)
  .notFound(notFound);