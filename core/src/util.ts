import {Graph, Operator} from "../types";

export const emptySubGraph = () => {
  return  null as Graph<any, any> | null
};

export const emptySubOperators = () => {
  return [] as Operator<any>[];
};

export const createArgs = (a: IArguments, offset: number) => {
  const args = [];
  for (let i = offset; i < a.length; i++) {
    args.push(a[i]);
  }
  return args;
};

export const isGraph = (v: Function): v is Graph<any, any> => {
  return v && (v as any).__type === "Graph";
};