import {Deposit, Fee, Withdraw} from "../../../shared/src/common";

const deposits = [
  {amount: 100.00, username: "steven"},
  {amount: 200.00, username: "steven"},
  {amount: 100.00, username: "steven"},
  {amount: 200.00, username: "steven"}
] as Deposit[];

const withdraws = [
  {amount: 25.00, username: "steven"},
  {amount: 10.00, username: "steven"},
  {amount: 30.00, username: "steven"},
] as Withdraw[];

const fees = [
  {amount: 0.10, username: "steven"},
  {amount: 0.10, username: "steven"},
  {amount: 0.10, username: "steven"},
] as Fee[];

const activitydb = {
  deposits: async (username: string): Promise<Deposit[]> => {
    return Promise.resolve(deposits.filter(d => d.username === username));
  },
  withdraws: async (username: string): Promise<Withdraw[]> => {
    return Promise.resolve(withdraws.filter(d => d.username === username));
  },
  fees: async (username: string): Promise<Fee[]> => {
    return Promise.resolve(fees.filter(d => d.username === username));
  },
  deposit: (amount: number, username: string): Promise<null> => {
    deposits.push({amount, username});
    return Promise.resolve(null);
  },
  withdraw: (amount: number, username: string): Promise<null> => {
    withdraws.push({amount, username});
    return Promise.resolve(null);
  }
};

export default activitydb;
