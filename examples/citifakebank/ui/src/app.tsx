import React from 'react';
import {Routes, Route} from "react-router-dom";
import Home from "./home/home";
import Team from "./about/team";
import History from "./about/history";
import Account from "./account/account";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about/team" element={<Team />}/>
        <Route path="/about/history" element={<History />}/>
        <Route path="/account" element={<Account />}/>
      </Routes>
    </div>
  );
}

export default App;
