import React from 'react';
import Sheet from "./sheet/ui/sheet";
import Home from "./home";
import {Routes, Route} from "react-router-dom";

const App = () => {
  const sheets = ["one", "two", "branch", "eslint"]
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home sheets={sheets} />}/>
        {sheets.map(s => <Route key={s} path={s} element={<Sheet sheet={s} />}/>)}
      </Routes>
    </div>
  );
}

export default App;