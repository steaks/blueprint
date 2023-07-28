import * as fs from "fs";
import {AppBlueprint} from "./rxblueprint";
import {SheetJSON} from "./types";

const sheet = (app: AppBlueprint): SheetJSON => {
  const hookTriggers = new Set(app.hooks.flatMap(h => h._operators.filter(o => o.__name.startsWith("Trigger_"))).map(t => t.__name.replace("Trigger_", "")));
  const graphsJSON = app.hooks.map(h => {
    const triggers = h._triggers.map(t => ({name: t.__name.startsWith("hook_") ? "self" : t.__name}));
    const inputs = h._inputs.map(t => ({name: t.__name.startsWith("hook_") ? "self" : t.__name}));
    const operators = h._operators.filter(o => o.__type !== "InputOperator").map(o => {
      return ({
        name: o.__name,
        type: o.__type,
        suboperators: o._suboperators.filter(o => o.__type !== "InputOperator").map(o => ({
          name: o.__name,
          type: o.__type,
          suboperators: [],
          subgraph: o._subgraph ? o._subgraph.__name : null
        })),
        subgraph: o._subgraph ? o._subgraph.__name : null,
      });
    });
    if (h._trigger) {
      triggers.push({name: h._trigger.__name});
    }
    return {name: h.__name, input: h._input, output: h.__name, operators, triggers, inputs};
  });
  const triggers = new Set(app.hooks.flatMap(h => h._triggers.map(t => t.__name)));
  const statesJSON = app.state.map(s => ({name: s.__name}));
  const eventsJSON = app.events
    .filter(e => triggers.has(e.__name))
    .map(e => ({name: e.__name}))
    .concat(app.hooks.filter(t => t._trigger).map(t => ({name: t._trigger!.__name})));
  return {name: app.name, graphs: graphsJSON, states: statesJSON, events: eventsJSON};
};

const build = (name: string, sheets: SheetJSON[], path: string = "./.blueprint") => {
  const fullPath = `${path}/build`;

  if (!fs.existsSync(fullPath)){
    fs.mkdirSync(fullPath, {recursive: true});
  }
  sheets.forEach(sheet => {
    const json = JSON.stringify(sheet, null, 2);
    const file = sheet.name;
    fs.writeFileSync(`${fullPath}/${file}.json`, json);
  });
  const slimSheets = sheets.map(s => ({name: s.name}));
  const index = {name, sheets: slimSheets};
  const indexJSON = JSON.stringify(index, null, 2);
  fs.writeFileSync(`${fullPath}/index.json`, indexJSON);
};

export default {sheet, build};