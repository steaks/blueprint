import {IndexJSON, SheetJSON} from "../types";

const fetchSheet = async (sheet: string) => {
  const sheetResponse = await fetch(`${window.location.origin}/sheets/${sheet}.json`, {headers: {'Content-Type': 'application/json'}})
  return await sheetResponse.json() as SheetJSON;
};

const fetchIndex = async () => {
  const sheetResponse = await fetch(`${window.location.origin}/sheets/index.json`, {headers: {'Content-Type': 'application/json'}})
  return await sheetResponse.json() as IndexJSON;
};

const api = {
  fetchSheet,
  fetchIndex
};

export default api;