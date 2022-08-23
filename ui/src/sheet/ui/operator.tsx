import {GraphJSON, OperatorJSON} from "../types";
import {Link} from "react-router-dom";

const Operator = (p: {readonly graph: GraphJSON; readonly operator: OperatorJSON}) => {
  const logPath = `/logs?graph=${p.graph.name}&operator=${p.operator.name}`;
  const errorsPath = `/errors?graph=${p.graph.name}&operator=${p.operator.name}`;
  return (
    <>
      <h2>{p.operator.name}</h2>
      <div>{p.operator.doc}</div>
      <div>{p.operator.path && <Link to={p.operator.path}>code</Link>}</div>
      <div><Link to={logPath}>logs</Link></div>
      <div><Link to={errorsPath}>errors</Link></div>
    </>
  );
};

export default Operator;
