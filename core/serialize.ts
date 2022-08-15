import {Graph} from "./core";
import * as fs from "fs";

interface OperatorJSON {
    readonly name: string;
    readonly type: string;
    readonly suboperators: OperatorJSON[];
    readonly subgraph: string | null;
}

interface GraphJSON {
    readonly name: string;
    readonly operators: OperatorJSON[];
}

export interface SheetJSON {
    name: string,
    graphs: GraphJSON[]
}

const sheet = (name: string, graphs: Graph<any, any>[]): SheetJSON => {
    const graphsJSON = graphs.map(g => {
        const operators = g.__operators.map(o => ({
            name: o.__name,
            type: o.__type,
            suboperators: o._suboperators.map(o => ({
                name: o.__name,
                type: o.__type,
                suboperators: [],
                subgraph: o._subgraph ? o._subgraph.__name : null
            })),
            subgraph: o._subgraph ? o._subgraph.__name : null,
        }));
        return {name: g.__name, operators};
    });
    return {name, graphs: graphsJSON};
};

const build = (sheets: SheetJSON[], path: string = "./.blueprint") => {
    const fullPath = `${path}/build`;

    if (!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath, {recursive: true});
    }
    const names = sheets.map(s => s.name);
    sheets.forEach(sheet => {
        const json = JSON.stringify(sheet, null, 2);
        const file = sheet.name;
        fs.writeFileSync(`${fullPath}/${file}.json`, json);
    });
    const index = JSON.stringify(names, null, 2);
    fs.writeFileSync(`${fullPath}/index.json`, index);
};

export default {
    sheet,
    build
};
