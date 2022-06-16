import {Graph} from "./core";

interface OperatorJSON {
    readonly name: string;
    readonly type: string;
    readonly operators: OperatorJSON[];
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
        const operators: OperatorJSON[] = g.__operators.map(o => ({name: o.__name, type: o.__type, operators: []}));
        return {name: g.__name, operators};
    });
    return {name, graphs: graphsJSON};
};

export default {
    sheet
};