import React from "react";
import {History, useHistory} from "../apps/history";

export default () => {
  const [history] = useHistory();


  return (
    <History>
      <a href="http://localhost:3000">Home</a>
      <div>{history}</div>
    </History>
  );
};