import React, {useEffect} from 'react';
import factory, {mxCell} from "mxgraph";

const mx = factory({
    mxBasePath: '',
});
console.log(mx.mxClient.VERSION);

interface OperatorJSON {
    readonly name: string;
    readonly type: string;
    readonly operators: OperatorJSON[];
}

interface GraphJSON {
    readonly name: string;
    readonly operators: OperatorJSON[];
}

interface SheetJSON {
    name: string,
    graphs: GraphJSON[]
}


const drawGraph = async () => {
    const sheetResponse = await fetch("http://localhost:3000/build/one.json", {headers: { 'Content-Type': 'application/json'}})
    const sheet = await sheetResponse.json() as SheetJSON;
    const container = document.getElementById("foobar")!;

    const graph = new mx.mxGraph(container);
    const model = graph.getModel();
    // Gets the default parent for inserting new cells. This
// is normally the first child of the root (ie. layer 0).
    const parent = graph.getDefaultParent();

// Adds cells to the model in a single step
    model.beginUpdate();
    try {
         sheet.graphs.forEach((g, i) => {
            const y = 20 + i * 200;
            graph.insertVertex(parent, null, g.name, 0, y, 100, 30);
            g.operators.reduce((prev, o, j) => {
                if (o.type === "ParallelOperator") {
                    const v = o.operators.map((o, k) => graph.insertVertex(parent, null, o.name, 150 + 150 * j, y + 50 * k, 100, 30))
                    if (prev !== null) {
                        v.map((vv, k) => {
                            prev.forEach(p => graph.insertEdge(parent, null, '', p, vv));
                        });
                    }
                    return v;
                }
                const v = graph.insertVertex(parent, null, o.name, 150 + 150 * j, y, 100, 30);
                if (prev !== null) {
                    prev.forEach(p => graph.insertEdge(parent, null, '', p, v));
                }
                return [v];
            }, null as null | mxCell[]);
        });

        const foo = graph.getStylesheet();
        console.log(foo);
        // const v1 = graph.insertVertex(parent, null, 'Hello', 20, 20, 80, 30);
        // const v2 = graph.insertVertex(parent, null, 'World', 200, 20, 80, 30);
    } finally {
        // Updates the display
        model.endUpdate();
    }

};

setTimeout(() => {
    drawGraph();
}, 1000);

function App() {
  return (
    <div>
      <div>HELLO WORLD</div>
        <div id="foobar" />
    </div>
  );
}

export default App;