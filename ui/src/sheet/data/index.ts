import {SheetJSON} from "../types";

const fetchSheet = async (sheet: string) => {
  const sheetResponse = await fetch(`http://localhost:3000/build/${sheet}.json`, {headers: {'Content-Type': 'application/json'}})
  return await sheetResponse.json() as SheetJSON;
};

export default {
  fetchSheet
};