import React from "react";
import {Atm, useDepositAmount, useSendDeposit} from "../apps/atm";

export default () => {
  const [depositAmount, setDepositAmount] = useDepositAmount();
  const [sendDeposit] = useSendDeposit();


  return (
    <div>
      <Atm>
        <h2>ATM:</h2>
        <input type="number" defaultValue={depositAmount} onChange={e => setDepositAmount(Number(e.currentTarget.value))}/>
        <button onClick={() => sendDeposit()}>Deposit</button>
      </Atm>
    </div>
  );
};