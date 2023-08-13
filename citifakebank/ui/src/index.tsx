import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import {BrowserRouter} from "react-router-dom";
import blueprint from "@blueprint/rxreact";
const {Blueprint} = blueprint;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Blueprint uri="http://localhost:8080">
        <App />
      </Blueprint>
    </BrowserRouter>
  </React.StrictMode>
);