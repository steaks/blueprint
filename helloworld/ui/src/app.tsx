import React from 'react';
import {Routes, Route} from "react-router-dom";
import Shop from "./ui/shop";
import HangOrBang from "./ui/hangOrBang";
import Home from "./ui/home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Home />}/>
        <Route path="/Shop" element={<Shop />}/>
        <Route path="/hangorbang" element={<HangOrBang />}/>
      </Routes>
    </div>
  );
}

export default App;
