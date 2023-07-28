import React from "react";
import {History, useHistory} from "../apps/history";

const UI = () => {
  const [history] = useHistory();


  return (
    <History>
      <a href="http://localhost:3000">Home</a>
      <div>{history}</div>
    </History>
  );
};

export default UI;