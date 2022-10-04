import {Graph} from "./core";
import * as fs from "fs";

interface OperatorJSON {
    readonly name: string;
    readonly type: string;
    readonly path: string | null;
    readonly suboperators: OperatorJSON[];
    readonly subgraph: string | null;
}

interface GraphJSON {
    readonly name: string;
    readonly operators: OperatorJSON[];
}

export interface SheetJSON {
    name: string,
    doc?: string,
    graphs: GraphJSON[]
}

const sheet = (name: string, graphs: Graph<any, any>[], doc?: string): SheetJSON => {
    const graphsJSON = graphs.map(g => {
        const operators = g.__operators.map(o => ({
            name: o.__name,
            doc: o._doc,
            type: o.__type,
            path: o._path,
            suboperators: o._suboperators.map(o => ({
                name: o.__name,
                type: o.__type,
                path: o._path,
                suboperators: [],
                subgraph: o._subgraph ? o._subgraph.__name : null
            })),
            subgraph: o._subgraph ? o._subgraph.__name : null,
        }));
        return {name: g.__name, input: g._input, output: g._output, doc: g._doc, operators};
    });
    return {name, doc, graphs: graphsJSON};
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
    const slimSheets = sheets.map(s => ({name: s.name, doc: s.doc}));
    const index = {name, sheets: slimSheets};
    const indexJSON = JSON.stringify(index, null, 2);
    fs.writeFileSync(`${fullPath}/index.json`, indexJSON);
};

export default {
    sheet,
    build
};
