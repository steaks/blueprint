import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Blueprint, route, Diagram} from "blueprint-react";
import Home from "./home";
import HelloWorld from './apps/helloWorld';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Blueprint uri={process.env.REACT_APP_URI}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/helloWorld" element={<HelloWorld />}/>
          <Route path={route} element={<Diagram />}/>
        </Routes>
      </BrowserRouter>
    </Blueprint>
  </React.StrictMode>
);