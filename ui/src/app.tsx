import React, {useEffect, useState} from 'react';
import Sheet from "./sheet/ui/sheet";
import Home from "./home/home";
import {Routes, Route} from "react-router-dom";
import data from "./sheet/data";
import {IndexJSON} from "./sheet/types";

const App = () => {
  const [index, setIndex] = useState(null as IndexJSON | null);
  useEffect(() => {
    data.fetchIndex().then(setIndex);
  }, []);
  return (
    <div>
      <Routes>
        {index && <Route path="/" element={<Home data={index} />}/>}
        {index && index.sheets.map(s => <Route key={s.name} path={s.name} element={<Sheet sheet={s.name} />}/>)}
      </Routes>
    </div>
  );
}

export default App;
