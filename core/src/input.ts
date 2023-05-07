import {Context, Operator} from "../types";
import {emptySubGraph, emptySubOperators} from "./util";

export const input = <I>(): Operator<I> => {
  const theOperator = (context: Context) => {
    context.data["input"] = context.data["__input"];
    return Promise.resolve(context.data["input"]);
  };
  theOperator.__name = "input";
  theOperator.__type = "InputOperator";
  theOperator._suboperators = emptySubOperators();
  theOperator._subgraph = emptySubGraph();
  return theOperator;
};