import factory, {mxCell, mxGraph} from "mxgraph";
import {GraphJSON, OperatorJSON, SheetJSON} from "../types";

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
  xOffset: 120,
  yOffset: 20,
  style: "whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#000000;"
};

const subgraphView = {
  height: 40,
  width: 100,
  style: "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00"
};
const branchView = {
  height: 40,
  width: 80,
  style: "shape=rhombus;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000"
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

const insertOperator = (graph: mxGraph, parent: mxCell, prev: mxCell, o: OperatorJSON, xOffset: number, yOffset: number) => {
  const view = o.subgraph ? graphView : operatorView;
  const v = graph.insertVertex(parent, null, o.name, xOffset, yOffset, view.width, view.height, view.style);
  graph.insertEdge(parent, null, '', prev, v, arrowStyle);
  const e = graph.insertVertex(parent, null, null, xOffset + dotView.xOffset, yOffset + dotView.yOffset, dotView.width, dotView.height, dotView.style);
  graph.insertEdge(parent, null, '', v, e, lineStyle);
  return e;
};


const insertParallelOperator = (graph: mxGraph, parent: mxCell, prev: mxCell, o: OperatorJSON, xOffset: number, yOffset: number) => {
  const v = o.suboperators.map((o, k) => {
    const view = o.subgraph ? graphView : operatorView;
    return graph.insertVertex(parent, null, o.name, xOffset, yOffset + subOperatorHeight * k, view.width, view.height, view.style);
  });
  v.forEach(vv => graph.insertEdge(parent, null, '', prev, vv, arrowStyle));
  const e = graph.insertVertex(parent, null, null, xOffset + dotView.xOffset, yOffset + dotView.yOffset, dotView.width, dotView.height, dotView.style);
  v.forEach(vv => graph.insertEdge(parent, null, '', vv, e, endLineStyle));
  return e;
};

const insertBranchOperator = (graph: mxGraph, parent: mxCell, prev: mxCell, o: OperatorJSON, xOffset: number, yOffset: number) => {
  const branchXOffset = 130;
  const b = graph.insertVertex(parent, null, o.name, xOffset, yOffset, branchView.width, branchView.height, branchView.style);
  graph.insertEdge(parent, null, '', prev, b, arrowStyle)
  const v = o.suboperators.map((o, k) => {
    const view = o.subgraph ? graphView : operatorView;
    return graph.insertVertex(parent, null, o.name, xOffset + branchXOffset, yOffset + subOperatorHeight * k, view.width, view.height, view.style);
  });
  v.forEach(vv => graph.insertEdge(parent, null, '', b, vv, dashedArrowStyle));
  const e = graph.insertVertex(parent, null, null, xOffset + branchXOffset + dotView.xOffset, yOffset + dotView.yOffset, dotView.width, dotView.height, dotView.style);
  v.forEach(vv => graph.insertEdge(parent, null, '', vv, e, endDashedLineStyle));
  return e;
};

const insertStart = (graph: mxGraph, parent: mxCell, xOffset: number, yOffset: number) => {
  const v = graph.insertVertex(parent, null, "start", xOffset, yOffset, operatorView.width, operatorView.height, operatorView.style);
  const e = graph.insertVertex(parent, null, null, xOffset + 120, yOffset + 20, dotView.width, dotView.height, dotView.style);
  graph.insertEdge(parent, null, '', v, e, lineStyle);
  return e;
};
const insertEnd = (graph: mxGraph, parent: mxCell, prev: mxCell, xOffset: number, yOffset: number) => {
  const v = graph.insertVertex(parent, null, "end", xOffset, yOffset, operatorView.width, operatorView.height, operatorView.style);
  graph.insertEdge(parent, null, '', prev, v, arrowStyle);
  return v;
};

const yPadding = 20;
const xPadding = 20;
const startOperatorWidth = 150;
const endOperatorWidth = 150;
const subOperatorHeight = 50;

const calculateOperatorHeight = (operator: OperatorJSON) =>
  Math.max(operator.suboperators.length * subOperatorHeight, subOperatorHeight);

const calculateGraphHeight = (graph: GraphJSON) => {
  const heights = graph.operators.map(calculateOperatorHeight)
  return yPadding + Math.max(...heights) + yPadding;
};

const calculateGraphsHeight = (graphs: GraphJSON[]) =>
  graphs.reduce((sum, g) => sum + calculateGraphHeight(g), 0);

const calculateOperatorWidth = (operator: OperatorJSON) =>
  operator.type === "BranchOperator" ? 290 : 150;

const calculateOperatorsWidth = (operators: OperatorJSON[]) =>
  operators.reduce((sum, o) => sum + calculateOperatorWidth(o), 0);

const calculateGraphWidth = (graph: GraphJSON) =>
  graph.operators.reduce((sum, o) => sum + calculateOperatorWidth(o), 0);

const insertOverivew = (graph: mxGraph, parent: mxCell, g: GraphJSON, xOffset: number, yOffset: number) => {
  const width = startOperatorWidth + calculateGraphWidth(g) + endOperatorWidth;
  console.log(width);
  const height = calculateGraphHeight(g);
  return graph.insertVertex(parent, null, g.name, xOffset, yOffset, width, height, firstLevelGraphView.style);
};

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
    sheet.graphs.forEach((g, i, graphs) => {
      const yOffset = yPadding + calculateGraphsHeight(graphs.slice(0, i)) + yPadding * i;
      const xOffset = 0;
      insertOverivew(graph, parent, g, xOffset, yOffset)
      const start = insertStart(graph, parent, xOffset + xPadding, yOffset + yPadding);
      const last = g.operators.reduce((prev, o, j) => {
        const xOffset = xPadding + startOperatorWidth + calculateOperatorsWidth(g.operators.slice(0, j));
        if (o.type === "ParallelOperator") {
          return insertParallelOperator(graph, parent, prev, o, xOffset, yOffset + yPadding);
        }
        if (o.type === "BranchOperator") {
          return insertBranchOperator(graph, parent, prev, o, xOffset, yOffset + yPadding);
        }
        if (o.type === "Operator") {
          return insertOperator(graph, parent, prev, o, xOffset, yOffset + yPadding);
        }
        throw new Error(`Unexpected operator ${o.type}`);
      }, start);
      const endXOffset = xPadding + startOperatorWidth + calculateGraphWidth(g);
      insertEnd(graph, parent, last, endXOffset, yOffset + yPadding);
    });
  } finally {
    // Updates the display
    model.endUpdate();
  }
};

export default {
  graph
};