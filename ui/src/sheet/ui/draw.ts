import factory, {mxCell, mxGraph} from "mxgraph";
import {OperatorJSON, SheetJSON} from "../types";

const mx = factory({mxBasePath: ''});

const graphView = {
  height: 40,
  width: 100,
  style: "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;"

};

const operatorView = {
  height: 40,
  width: 100,
  style: "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000"
};

const dotView = {
  height: 0,
  width: 0,
  style: "ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#000000;"
};

const subgraphView = {
  height: 40,
  width: 100,
  style: "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00"
};

const calculateOperatorHeight = (operator: OperatorJSON) => {
  return operator.suboperators.length ? operator.suboperators.length * 60 : 60;
};

const calculateOperatorWidth = (operator: OperatorJSON) => {
  return 200;
};

const lineStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#000000;endArrow=none;entryX=0;entryY=0.5;";
const endLineStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#000000;endArrow=none;entryY=1;";
const endDashedLineStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#000000;endArrow=none;entryY=1;dashed=1;";
const arrowStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#000000;entryX=0;entryY=0.5;";
const dashedArrowStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#000000;entryX=0;entryY=0.5;dashed=1;";

const firstLevelGraphView = {
  height: (operators: OperatorJSON[]) => {
    return operators.reduce((s, o) => s + calculateOperatorHeight(o), 0);
  },
  width: (operators: OperatorJSON[]) => {
    return operators.reduce((s, o) => s + calculateOperatorWidth(o), 200);
  },
  style: "rounded=0;whiteSpace=wrap;fillColor=#dae8fc;shadow=0;gradientDirection=north;strokeColor=#6c8ebf;align=left;verticalAlign=top;horizontal=1;labelBackgroundColor=none;html=1;fontStyle=1"
};

const insertOperator = (graph: mxGraph, parent: mxCell, prev: mxCell, o: OperatorJSON, j: number, y: number) => {
  const x = j + 1;
  const view = o.subgraph ? graphView : operatorView;
  const v = graph.insertVertex(parent, null, o.name, xPadding + 150 * x, y + yPadding, view.width, view.height, view.style);
  graph.insertEdge(parent, null, '', prev, v, arrowStyle);
  const e = graph.insertVertex(parent, null, null, xPadding + 150 * x + 120, y + yPadding + 20, dotView.width, dotView.height, dotView.style);
  graph.insertEdge(parent, null, '', v, e, lineStyle);
  return e
};

const insertParallelOperator = (graph: mxGraph, parent: mxCell, prev: mxCell, o: OperatorJSON, j: number, y: number) => {
  const x = j + 1;
  const v = o.suboperators.map((o, k) => {
    const view = o.subgraph ? graphView : operatorView;
    return graph.insertVertex(parent, null, o.name, xPadding + 150 * x, y + yPadding + 50 * k, view.width, view.height, view.style);
  });
  v.forEach(vv => graph.insertEdge(parent, null, '', prev, vv, arrowStyle));
  const e = graph.insertVertex(parent, null, null, xPadding + 150 * x + 120, y + yPadding + 20, dotView.width, dotView.height, dotView.style);
  v.forEach(vv => graph.insertEdge(parent, null, '', vv, e, endLineStyle));
  return e;
};

const insertBranchOperator = (graph: mxGraph, parent: mxCell, prev: mxCell, o: OperatorJSON, j: number, y: number) => {
  const x = j + 1;
  const v = o.suboperators.map((o, k) => {
    const view = o.subgraph ? graphView : operatorView;
    return graph.insertVertex(parent, null, o.name, xPadding + 150 * x, y + yPadding + 50 * k, view.width, view.height, view.style);
  });
  v.forEach(vv => graph.insertEdge(parent, null, '', prev, vv, dashedArrowStyle));
  const e = graph.insertVertex(parent, null, null, xPadding + 150 * x + 120, y + yPadding + 20, dotView.width, dotView.height, dotView.style);
  v.forEach(vv => graph.insertEdge(parent, null, '', vv, e, endDashedLineStyle));
  return e;
};

const insertStart = (graph: mxGraph, parent: mxCell, y: number) => {
  const v = graph.insertVertex(parent, null, "start", xPadding, y + yPadding, operatorView.width, operatorView.height, operatorView.style);
  const e = graph.insertVertex(parent, null, null, xPadding + 120, y + yPadding + 20, dotView.width, dotView.height, dotView.style);
  graph.insertEdge(parent, null, '', v, e, lineStyle);
  return e;
};
const insertEnd = (graph: mxGraph, parent: mxCell, prev: mxCell, j: number, y: number) => {
  const x = j + 1;
  const v = graph.insertVertex(parent, null, "end", xPadding + 150 * x, y + yPadding, operatorView.width, operatorView.height, operatorView.style);
  graph.insertEdge(parent, null, '', prev, v, arrowStyle);
  return v;
};

const yPadding = 50;
const xPadding = 20;

const graph = async (sheet: SheetJSON) => {
  const container = document.getElementById(sheet.name)!;

  const graph = new mx.mxGraph(container);
  graph.setEnabled(false);
  const model = graph.getModel();
  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  const parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  model.beginUpdate();
  try {
    sheet.graphs.forEach((g, i) => {
      const y = 20 + i * 200;
      const overview = graph.insertVertex(parent, null, g.name, 0, y, firstLevelGraphView.width(g.operators), firstLevelGraphView.height(g.operators), firstLevelGraphView.style);
      const start = insertStart(graph, parent, y);
      const last = g.operators.reduce((prev, o, j) => {
        if (o.type === "ParallelOperator") {
          return insertParallelOperator(graph, parent, prev, o, j, y);
        }
        if (o.type === "BranchOperator") {
          return insertBranchOperator(graph, parent, prev, o, j, y);
        }
        if (o.type === "Operator") {
          return insertOperator(graph, parent, prev, o, j, y)
        }
        throw new Error(`Unexpected operator ${o.type}`);
      }, start);
      insertEnd(graph, parent, last, g.operators.length, y);
    });
  } finally {
    // Updates the display
    model.endUpdate();
  }
};

export default {
  graph
};