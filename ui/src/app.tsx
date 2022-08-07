import React, {useEffect, useState} from 'react';
import Sheet from "./sheet/ui/sheet";
import Home from "./home";
import {Routes, Route} from "react-router-dom";
import data from "./sheet/data";

const App = () => {
  const [sheets, setSheets] = useState([] as string[]);
  useEffect(() => {
    data.fetchIndex().then(setSheets);
  }, []);
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
