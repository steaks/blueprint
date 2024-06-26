import React, {useCallback, useEffect, useId, useState} from "react";
import data from "../data";
import draw from "./draw";
import {GraphJSON, OperatorJSON} from "../types"; import Operator from "./operator";
import {route} from "../../../constants";

interface Props {
  readonly sheet: string;
}

const renderedSheets = new Set();

const Sheet = (p: Props) => {
  const id = useId();
  const [operator, setOperator] = useState(null as {readonly graph: GraphJSON; readonly operator: OperatorJSON} | null);
  const onClick = useCallback((graph: GraphJSON, operator: OperatorJSON) => {
    setOperator({graph, operator})
  }, []);
  useEffect(() => {
    if (!renderedSheets.has(id)) {
      renderedSheets.add(id);
      data.fetchSheet(p.sheet).then(g => draw.graph(g, onClick));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <a href={route}>Home</a>
      <div id={p.sheet} />
      {operator && <Operator graph={operator.graph} operator={operator.operator}/>}
    </>
  );
}

export default Sheet;
