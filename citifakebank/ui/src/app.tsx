import React, {useState} from 'react';
import {Routes, Route} from "react-router-dom";
import Home from "./home/home";
import {Subscribe} from "@react-rxjs/core";
import Team from "./about/team";
import History from "./about/history";
import Account from "./account/account";

const App = () => {
  return (
    <div>
      <Subscribe fallback={<></>}>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/about/team" element={<Team />}/>
          <Route path="/about/history" element={<History />}/>
          <Route path="/account" element={<Account />}/>
        </Routes>
      </Subscribe>
    </div>
  );
}

export default App;
