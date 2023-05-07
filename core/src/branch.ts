import {Operator, Branch0, Branch1, Context, Func1} from "../types";
import {operator} from "./operator";
import {createArgs, emptySubGraph} from "./util";

function branch0<B>(name: string): Branch0<B> {
  const obj = {
    __name: name,
    __cases: [] as {check: () => boolean, func: () => B | Promise<B>}[],
    __default: undefined as undefined | (() => B | Promise<B>),
    case: (check: () => boolean, func: () => B | Promise<B>): Branch0<B> => {
      obj.__cases.push({check, func});
      return obj;
    },
    default: (func: () => B | Promise<B>): Operator<B> => {
      obj.__default = func;
      const allCases = [...obj.__cases, ...obj.__default ? [{check: () => true, func: obj.__default}] : []] ;
      const theOperator = async (c: Context) => {
        let complete = false;
        const ret = await allCases.reduce(async (prev: Promise<any>, c) => {
          const p = await prev;
          if (complete) {
            return p;
          }
          if (c.check()) {
            complete = true;
            return Promise.resolve(c.func());
            const ret = await Promise.resolve(c.func())
            return ret;
          }
          return Promise.resolve();
        }, Promise.resolve()) as unknown as Promise<B>;
        c.data[name] = ret;
        return ret;
      };

      theOperator.__name = name;
      theOperator.__type = "Branch";
      theOperator._suboperators = allCases.map(c => c.func).map(operator);
      theOperator._subgraph = emptySubGraph();
      return theOperator;
    }
  };

  return obj;
}

function branch1<A0, B>(name: string, a0: Operator<A0>): Branch1<A0, B> {
  const args = createArgs(arguments, 1);
  const obj = {
    __name: name,
    __cases: [] as {check: (a0: A0) => boolean, func: Func1<A0, B>}[],
    __default: undefined as undefined | Func1<A0, B>,
    case: (check: (a0: A0) => boolean, func: Func1<A0, B>): Branch1<A0, B> => {
      obj.__cases.push({check, func});
      return obj;
    },
    default: (func: Func1<A0, B>): Operator<B> => {
      obj.__default = func;
      const allCases = [...obj.__cases, ...obj.__default ? [{check: (a0: A0) => true, func: obj.__default}] : []] ;
      const theOperator = async (c: Context) => {
        const a = args.map(a => c.data[a.__name]);
        let complete = false;
        const ret = await allCases.reduce(async (prev: Promise<any>, c) => {
          const p = await prev;
          const check = c.check as Function;
          const func = c.func as Function;
          if (complete) {
            return p;
          }
          if (check.apply(null, a)) {
            const ret = await Promise.resolve(func.apply(null, a));
            complete = true;
            return ret;
          }
          return Promise.resolve();
        }, Promise.resolve()) as Promise<B>;
        c.data[name] = ret;
        return ret;
      };

      theOperator.__name = name;
      theOperator.__type = "BranchOperator";
      theOperator._suboperators = allCases.map(c => c.func).map(f => operator(f, a0));
      theOperator._subgraph = emptySubGraph();
      return theOperator;
    }
  };

  return obj;
}

export function branch<B>(name: string): Branch0<B>;
export function branch<A0, B>(name: string, a0: Operator<A0>): Branch1<A0, B>;

export function branch(): Branch0<any> | Branch1<any, any> {
  if (arguments.length === 1) return (branch0 as Function).apply(null, arguments);
  if (arguments.length === 2) return (branch1 as Function).apply(null, arguments);
  throw new Error("Unexpected arguments length");
}