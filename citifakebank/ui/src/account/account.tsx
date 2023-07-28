import Balance from "./balance";
import Activity from "./activity";
import Atm from "./atm";
import React from "react";

const Account = () => {
  return (
    <div>
      <a href="http://localhost:3000">Home</a>
      <hr/>
      <Balance />
      <hr/>
      <Activity />
      <hr/>
      <Atm />
    </div>

  );
};

export default Account;