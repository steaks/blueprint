import React from 'react';
import ReactDOM from 'react-dom/client';
import UserProfile from './ui/userProfile';
import {Blueprint} from "./rxreact";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Blueprint>
      <UserProfile />
    </Blueprint>
  </React.StrictMode>
);