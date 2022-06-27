import React from 'react';
import {Link} from "react-router-dom";

interface Props {
  readonly sheets: string[];
}

const Home = (p: Props) => {
  return (
    <>
      {p.sheets.map(s => <div><Link to={`/${s}`}>{s}</Link></div>)}
    </>
  );
};

export default Home;