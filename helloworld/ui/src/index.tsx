import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import {BrowserRouter} from "react-router-dom";
import {Blueprint} from "./rxreact";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Blueprint>
        <App />
      </Blueprint>
    </BrowserRouter>
  </React.StrictMode>
);