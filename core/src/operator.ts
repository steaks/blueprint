import {Func0, Func1, Func2, Func3, Func4, Operator, Context, Graph} from "../types";
import {createArgs, emptySubGraph, emptySubOperators, isGraph} from "./util";

export function operator<R>(func: Func0<R>): Operator<R>;
export function operator<A0, R>(func: Func1<A0, R> | Graph<A0, R>, arg0: Operator<A0>): Operator<R>;
export function operator<A0, A1, R>(func: Func2<A0, A1, R>, arg0: Operator<A0>, arg1: Operator<A1>): Operator<R>;
export function operator<A0, A1, A2, R>(func: Func3<A0, A1, A2, R>, arg0: Operator<A0>, arg1: Operator<A1>, arg2: Operator<A2>): Operator<R>;
export function operator<A0, A1, A2, A3, R>(func: Func4<A0, A1, A2, A3, R>, arg0: Operator<A0>, arg1: Operator<A1>, arg2: Operator<A2>, arg3: Operator<A3>): Operator<R>;

export function operator(): Operator<unknown> {
  const func = arguments[0];
  const args = createArgs(arguments, 1);
  // const theOperator = createOperator(func, args);
  const theOperator = async (c: Context): Promise<unknown> => {
    const a = args.map(a => c.data[a.__name]);
    const ret = await Promise.resolve(func.apply(null, a));
    c.data[func.name] = ret;
    return ret;
  };
  theOperator.__name = func.__name || func.name;
  theOperator.__type = "Operator";
  theOperator._suboperators = emptySubOperators();
  theOperator._subgraph = isGraph(func) ? func : emptySubGraph();
  return theOperator;
}
