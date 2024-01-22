import {IndexJSON, SheetJSON} from "../types";
import {config} from "../../../client";

const fetchSheet = async (sheet: string) => {
  const sheetResponse = await fetch(`${config.uri}/__sheet__?sheet=${sheet}`, {headers: {'Content-Type': 'application/json'}})
  return await sheetResponse.json() as SheetJSON;
};

const fetchIndex = async () => {
  const sheetResponse = await fetch(`${config.uri}/__sheets__`, {headers: {'Content-Type': 'application/json'}})
  return await sheetResponse.json() as IndexJSON;
};

const api = {
  fetchSheet,
  fetchIndex
};

export default api;