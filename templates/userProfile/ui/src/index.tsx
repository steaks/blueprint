import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Blueprint} from "blueprint-react";
import Home from "./home";
import UserProfile from './apps/userProfile';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Blueprint uri={process.env.REACT_APP_URI}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/userProfile" element={<UserProfile />}/>
        </Routes>
      </BrowserRouter>
    </Blueprint>
  </React.StrictMode>
);