import React from 'react';
import ReactDOM from 'react-dom/client';
import UserProfile from './ui/userProfile';
import {Blueprint} from "./rxreact";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);


console.log(process.env);

root.render(
  <React.StrictMode>
    <Blueprint uri={process.env.REACT_APP_URI}>
      <UserProfile />
    </Blueprint>
  </React.StrictMode>
);