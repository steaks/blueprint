import * as fs from "fs";
import {Graph, SheetJSON} from "../types";

const sheet = (name: string, graphs: Graph<any, any>[]): SheetJSON => {
    const agg: Graph<any, any>[] = [];
    const findGraphs = (g: Graph<any, any>) => {
        agg.push(g);
        const operators = g._operators.filter(o => o.__type !== "InputOperator");
        for (var i = 0; i < operators.length; i++) {
            const o = operators[i];
            if (o._subgraph) {
                findGraphs(o._subgraph);
            }
            if (o._suboperators.length > 0) {
                const suboperators = o._suboperators.filter(o => o.__type !== "InputOperator");
                for (var j = 0; j < suboperators.length; j++) {
                    const oo = suboperators[j];
                    if (oo._subgraph) {
                        findGraphs(oo._subgraph)
                    }
                }
            }
        }
    };
    graphs.map(findGraphs);
    const ggs = agg;
    const graphsJSON = ggs.map(g => {
        const operators = g._operators.filter(o => o.__type !== "InputOperator").map(o => {
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
        return {name: g.__name, input: g._input, output: g._output, operators};
    });
    return {name, graphs: graphsJSON};
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