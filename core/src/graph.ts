import {Context, Graph, Operator} from "../types";

export function graph<A, B>(
  name: string,
  input: Operator<A>,
  o0: Operator<B>
): Graph<A, B>;

export function graph<A, B, C>(
  name: string,
  input: Operator<A>,
  o0: Operator<B>,
  o1: Operator<C>
): Graph<A, C>;

export function graph<A, B, C, D>(
  name: string,
  input: Operator<A>,
  o0: Operator<B>,
  o1: Operator<C>,
  o2: Operator<D>
): Graph<A, D>;

export function graph<A, B, C, D, E>(
  name: string,
  input: Operator<A>,
  o0: Operator<B>,
  o1: Operator<C>,
  o2: Operator<D>,
  o3: Operator<E>
): Graph<A, E>;

export function graph<A, B, C, D, E, F>(
  name: string,
  input: Operator<A>,
  o0: Operator<B>,
  o1: Operator<C>,
  o2: Operator<D>,
  o3: Operator<E>,
  o4: Operator<F>
): Graph<A, F>;

export function graph<A, B, C, D, E, F, G>(
  name: string,
  input: Operator<A>,
  o0: Operator<B>,
  o1: Operator<C>,
  o2: Operator<D>,
  o3: Operator<E>,
  o4: Operator<F>,
  o5: Operator<G>
): Graph<A, G>;

export function graph(): Graph<any, any> {
  const operators = [] as Operator<unknown>[];
  const name = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    operators.push(arguments[i]);
  }

  const theGraph = async (i: any): Promise<any> => {
    const context = {graph: name, data: {}} as Context;
    context.data["__input"] = i;
    const ret = operators.reduce(async (prev, op) => {
      await prev;
      const ret = await op(context);
      context.data[op.__name] = ret;
      return ret;
    }, Promise.resolve(i));
    return await ret;
  };
  theGraph.__name = name;
  theGraph.__type = "Graph";
  theGraph._operators = operators;
  theGraph._input = operators[0].__name;
  theGraph._output = operators[operators.length - 1].__name;
  return theGraph;
}