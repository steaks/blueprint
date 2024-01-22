import React from "react";
import {app, task} from "blueprint-react";

export const useBalance = task<string>("balance", "balance");
export const Balance = app("balance")

const UI = () => {
  const [balance] = useBalance();


  return (
    <div>
      <Balance>
        <h2>Balance: {balance}</h2>
      </Balance>
    </div>
  );
};

export default UI;