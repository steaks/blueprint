import React, {useEffect} from "react";
import data from "../data";
import draw from "./draw";

interface Props {
  readonly sheet: string;
}

const renderedSheets = new Set();

const Sheet = (p: Props) => {
  useEffect(() => {
    if (!renderedSheets.has(p.sheet)) {
      renderedSheets.add(p.sheet);
      data.fetchSheet(p.sheet).then(draw.graph);
    }
  }, []);
  return (
    <>
      <div id={p.sheet} />
    </>
  );
}

export default Sheet;