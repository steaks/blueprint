import React from "react";
import {Balance, useBalance} from "../apps/balance";

export default () => {
  const [balance] = useBalance();


  return (
    <div>
      <Balance>
        <h2>Balance: {balance}</h2>
      </Balance>
    </div>
  );
};