import React from 'react';
import ReactDOM from 'react-dom/client';
import UserProfile from './apps/userProfile';
import {Blueprint, Diagram, route} from "blueprint-react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);


console.log(process.env);

root.render(
  <React.StrictMode>
    <Blueprint uri={process.env.REACT_APP_URI}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserProfile />}/>
          <Route path={route} element={<Diagram />}/>
        </Routes>
      </BrowserRouter>
    </Blueprint>
  </React.StrictMode>
);