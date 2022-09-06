import {GraphJSON, OperatorJSON} from "../types";
import {Link} from "react-router-dom"; import {useEffect, useState} from "react"; import data from "../data";

const Operator = (p: {readonly graph: GraphJSON; readonly operator: OperatorJSON}) => {
  return (
    <div style={{border: "1px solid black", width: "300px", marginTop: "10px", paddingBottom: "10px"}}>
      <i>Operator details</i>
      <div style={{marginLeft: "10px"}}>
        <h2>Name: {p.operator.name}</h2>
        {p.operator.doc && <div>Description: {p.operator.doc}</div>}
        <div>Code: {p.operator.path && <a href={p.operator.path}>link to github</a>}</div>
      </div>
    </div>
  );
};

export default Operator;
