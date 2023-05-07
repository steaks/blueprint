import {Context, Func0, Func1, Func2, Func3, Func4, Graph, Operator} from "../types";
import {createArgs, emptySubGraph} from "./util";
import {operator} from "./operator";

export function parallel<R>(funcs: Func0<R>[]): Operator<R[]>;
export function parallel<A0, R>(funcs: (Func1<A0, R> | Graph<A0, R>)[], arg0: Operator<A0>): Operator<R[]>;
export function parallel<A0, A1, R>(funcs: Func2<A0, A1, R>[], arg0: Operator<A0>, arg1: Operator<A1>): Operator<R[]>;
export function parallel<A0, A1, A2, R>(funcs: Func3<A0, A1, A2, R>[], arg0: Operator<A0>, arg1: Operator<A1>, arg2: Operator<A2>): Operator<R[]>;
export function parallel<A0, A1, A2, A3, R>(funcs: Func4<A0, A1, A2, A3, R>[], arg0: Operator<A0>, arg1: Operator<A1>, arg2: Operator<A2>, arg3: Operator<A3>): Operator<R[]>;

export function parallel(): Operator<unknown[]> {
  const funcs = arguments[0] as Function[];
  const name = funcs.map(f => f.name).join(",");
  const args = createArgs(arguments, 1);

  const theOperator = async (c: Context) => {
    const a = args.map(a => c.data[a.__name]);
    const ret = Promise.all(funcs.map(f => f.apply(null, a)))
    c.data[name] = ret;
    return ret;
  };

  theOperator.__name = name;
  theOperator.__type = "ParallelOperator";
  theOperator._suboperators = funcs.map(f => operator(f as Func0<any>));
  theOperator._subgraph = emptySubGraph();
  return theOperator;
}