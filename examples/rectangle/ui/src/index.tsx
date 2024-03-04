import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Blueprint, Diagram, route} from "blueprint-react";
import Home from "./home";
import MyApp from "./apps/myApp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Blueprint uri={process.env.REACT_APP_URI}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/myApp" element={<MyApp />}/>
          <Route path={route} element={<Diagram />} />
        </Routes>
      </BrowserRouter>
    </Blueprint>
  </React.StrictMode>
);