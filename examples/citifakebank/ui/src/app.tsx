import React from 'react';
import {Routes, Route} from "react-router-dom";
import Home from "./home/home";
import Team from "./apps/about/team";
import History from "./apps/about/history";
import Account from "./apps/account/account";
import {Diagram, route} from "blueprint-react";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about/team" element={<Team />}/>
        <Route path="/about/history" element={<History />}/>
        <Route path="/account" element={<Account />}/>
        <Route path={route} element={<Diagram />}/>
      </Routes>
    </div>
  );
}

export default App;
