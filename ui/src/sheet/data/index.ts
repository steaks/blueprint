import {IndexJSON, SheetJSON} from "../types";

const fetchSheet = async (sheet: string) => {
  const sheetResponse = await fetch(`http://localhost:3000/sheets/${sheet}.json`, {headers: {'Content-Type': 'application/json'}})
  return await sheetResponse.json() as SheetJSON;
};

const fetchIndex = async () => {
  const sheetResponse = await fetch(`http://localhost:3000/sheets/index.json`, {headers: {'Content-Type': 'application/json'}})
  return await sheetResponse.json() as IndexJSON;
};

export default {
  fetchSheet,
  fetchIndex
};
