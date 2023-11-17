import React from 'react';
import ReactDOM from 'react-dom/client';
import UserProfile from './ui/userProfile';
import Home from "./ui/home";
import {Blueprint} from "blueprint-react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

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