import {GraphJSON, OperatorJSON} from "../types";

const Operator = (p: {readonly graph: GraphJSON; readonly operator: OperatorJSON}) => {
  const input = "";
  const output = "";
  const logging = "ON";
  return (
    <div style={{border: "1px solid black", width: "300px", marginTop: "10px", paddingBottom: "10px"}}>
      <i>Operator details</i>
      <div style={{marginLeft: "10px"}}>
        <h2>Name: {p.operator.name}</h2>
        {p.operator.doc && <div>Description: {p.operator.doc}</div>}
        <div>Code: {p.operator.path && <a href={p.operator.path}>link to github</a>}</div>
        <div>Input: {input}</div>
        <div>Output: {output}</div>
        <div>Logging: {logging}</div>
        <div>Logs: {p.operator.path && <a href={p.operator.path}>link to logs</a>}</div>
        <div>Inputs: {p.operator.path && <a href={p.operator.path}>link to inputs</a>}</div>
        <div>Outputs: {p.operator.path && <a href={p.operator.path}>link to outputs</a>}</div>
        <div>Tests: {p.operator.path && <a href={p.operator.path}>link to tests</a>}</div>
      </div>
    </div>
  );
};

export default Operator;
