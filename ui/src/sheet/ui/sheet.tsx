import React, {useCallback, useEffect,useId,useState} from "react";
import data from "../data";
import draw from "./draw";
import {Link} from "react-router-dom";
import {randomUUID} from "crypto"; import {OperatorJSON} from "../types"; import Operator from "./operator";

interface Props {
  readonly sheet: string;
}

const renderedSheets = new Set();

const Sheet = (p: Props) => {
  const id = useId();
  const [operator, setOperator] = useState(null as OperatorJSON | null);
  const onClick = useCallback((o: OperatorJSON) => {
    setOperator(o)
  }, []);
  useEffect(() => {
    if (!renderedSheets.has(id)) {
      renderedSheets.add(id);
      data.fetchSheet(p.sheet).then(g => draw.graph(g, onClick));
    }
  }, []);
  return (
    <>
      <Link to="/">&lt; Home</Link>
      <div id={p.sheet} />
      {operator && <Operator operator={operator}></Operator>}
    </>
  );
}

export default Sheet;
