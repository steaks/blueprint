import React from "react";
import {app, task} from "blueprint-react";
import {Deposit, Fee, Withdraw} from "../../../../shared/src/common";

const useDeposits = task<Deposit[]>("activity", "deposits");
const useWithdraws = task<Withdraw[]>("activity", "withdraws");
const useFees = task<Fee[]>("activity", "fees");
const Activity = app("activity")

const UI = () => {
  const [deposits] = useDeposits();
  const [withdraws] = useWithdraws();
  const [fees] = useFees();


  return (
    <Activity>
      <div><h2>Deposits</h2>{deposits && deposits.map((d, i) => <div key={i}>${d.amount}</div>)}</div>
      <div><h2>Withdraws</h2>{withdraws && withdraws.map((w, i) => <div key={i}>${w.amount}</div>)}</div>
      <div><h2>Fees</h2>{fees && fees.map((f, i) => <div key={i}>${f.amount}</div>)}</div>
    </Activity>
  );
};

export default UI;