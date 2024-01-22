import React, {useEffect, useState} from 'react';
import Sheet from "./sheet/ui/sheet";
import Home from "./home/home";
import data from "./sheet/data/index";
import {IndexJSON} from "./sheet/types";

export const Diagram = () => {
  const [index, setIndex] = useState(null as IndexJSON | null);
  useEffect(() => {
    data.fetchIndex().then(setIndex);
  }, []);
  const queryParams = new URLSearchParams(window.location.search);
  const sheet = queryParams.get("sheet");
  if (index && !sheet) {
    return <Home data={index} />;
  }
  if (index && sheet) {
    return <Sheet sheet={sheet}></Sheet>
  }
  return <></>;
};