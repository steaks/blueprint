import React from 'react';
import ReactDOM from 'react-dom/client';
import Team from './apps/team';
import {Blueprint} from "blueprint-react";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Blueprint uri={process.env.REACT_APP_URI}>
      <Team />
    </Blueprint>
  </React.StrictMode>
);