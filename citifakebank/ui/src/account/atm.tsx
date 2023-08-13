import React from "react";
import {Atm, useDepositAmount, useDeposit, useWithdraw, useWithdrawAmount} from "../apps/atm";

const UI = () => {
  const [depositAmount, setDepositAmount] = useDepositAmount();
  const [withdrawAmount, setWithdrawAmount] = useWithdrawAmount();
  const [, deposit] = useDeposit();
  const [, withdraw] = useWithdraw();


  return (
    <div>
      <Atm>
        <h2>ATM:</h2>
        <input type="number" defaultValue={depositAmount} onChange={e => setDepositAmount(Number(e.currentTarget.value))}/>
        <button onClick={deposit}>Deposit</button>
        <br />
        <input type="number" defaultValue={withdrawAmount} onChange={e => setWithdrawAmount(Number(e.currentTarget.value))}/>
        <button onClick={withdraw}>Withdraw</button>
      </Atm>
    </div>
  );
};

export default UI;