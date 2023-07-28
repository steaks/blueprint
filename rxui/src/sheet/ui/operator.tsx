import {GraphJSON, OperatorJSON} from "../types";

const Operator = (p: {readonly graph: GraphJSON; readonly operator: OperatorJSON}) => {
  return (
    <div style={{border: "1px solid black", width: "300px", marginTop: "10px", paddingBottom: "10px"}}>
      <i>Operator details</i>
      <div style={{marginLeft: "10px"}}>
        <h2>Name: {p.operator.name}</h2>
        <div>Type: {p.operator.type}</div>
      </div>
    </div>
  );
};

export default Operator;
