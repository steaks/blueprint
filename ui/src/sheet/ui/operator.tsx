import {OperatorJSON} from "../types";
import {Link} from "react-router-dom";

const Operator = (p: {readonly operator: OperatorJSON}) => {
  return (
    <>
      <h2>{p.operator.name}</h2>
      <p>{p.operator.doc}</p>
      {p.operator.path && <Link to={p.operator.path}>code</Link>}
    </>
  );
};

export default Operator;
