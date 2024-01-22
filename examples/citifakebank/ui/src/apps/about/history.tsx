import React from "react";
import {app, task} from "blueprint-react";


const useHistory = task<string>("history", "history");
const History = app("history")

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