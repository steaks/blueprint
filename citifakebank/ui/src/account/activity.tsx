import React from "react";
import {Activity, useDeposits, useFees, useWithdraws} from "../apps/activity";

export default () => {
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