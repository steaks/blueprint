import React from 'react';
import {Link} from "react-router-dom";
import {IndexJSON} from "./sheet/types";

interface Props {
  readonly data: IndexJSON;
}

const Sheet = (p: {readonly name: string; readonly doc?: string;}) => {
  return (
    <div style={{marginTop: "10px"}}>
      <Link to={`/${p.name}`}>{p.name}</Link>
      <div><span>{p.doc}</span></div>
    </div>
  );
};

const Home = (p: Props) => {
  return (
    <>
      <h1>Architecture for {p.data.name}.</h1>
      <div style={{marginTop: "10px"}}><h2>Modules:</h2></div>
      {p.data.sheets.map(s => <div key={s.name}><Sheet {...s} /></div>)}
    </>
  );
};

export default Home;
