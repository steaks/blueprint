/* eslint-disable max-len */

type SyncFunc<A, B, C, R> = (p: A, context: C) => B | End<R>;
type TapFunc<A, C> = (p: A, context: C) => any;
type AsyncFunc<A, B, C, R> = (p: A, context: C) => Promise<B | End<R>>;
type ShortcircuitAsyncFunc<A, B, C, R> = (p: A, context: C) => Promise<B | End<R>>;
export type AsyncParams<A, B, C, R> = AsyncFunc<A, B, C, R> | Graph<A, B> | ShortcircuitAsyncFunc<A, B, C, R> | SyncFunc<A, B, C, R>;
type TapParams<A, C> = AsyncFunc<A, any, C, any> | Graph<A, any> | TapFunc<A, C>;

//test test test

export interface End<V> {
    __type: "END",
    value: V
}

export interface AsyncOperator<A, B, C, R> {
    (p: A, context: C): Promise<B | End<R>>;
    readonly __name: string;
    readonly __type: string;
    readonly _suboperators: AsyncOperator<any, any, any, any>[];
    readonly _subgraph: Graph<any, any> | null;
    readonly _check: string | null;
    readonly glue: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly allowShortCircuit: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly bname: (value: string) => AsyncOperator<A, B, C, R>;
    readonly suboperators: (value: AsyncOperator<any, any, any, any>[]) => AsyncOperator<A, B, C, R>;
    readonly subgraph: (value: Graph<any, any> | null) => AsyncOperator<A, B, C, R>;
    readonly check: (value: string) => AsyncOperator<A, B, C, R>;
    readonly type: (value: string) => AsyncOperator<A, B, C, R>;
    readonly doc: (value: string) => AsyncOperator<A, B, C, R>
}

type Operator<A, B, C, R> = AsyncOperator<A, B, C, R>

export interface Graph<A, B> {
    (a: A): Promise<B>;
    readonly __type: string;
    readonly __name: string;
    readonly __operators: Operator<any, any, any, any>[];
}

const tap = <A, C>(func: TapParams<A, C>): AsyncOperator<A, A, C, unknown> => {
    const apply = (a: A, context: C) => {
        func(a, context);
        return Promise.resolve(a);
    };
    return _operator<A, A, C, unknown>(apply)
      .bname(func.name)
      .subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, A, C, unknown>;
};

const _operator = <A, B, C, R>(func: AsyncParams<A, B, C, R>): AsyncOperator<A, B, C, R> => {
    const name = (func as any).__name || func.name;
    const apply = async (a: A, context: C) =>
        await func(a, context)
    apply.__name = name;
    apply.__type = "Operator";
    apply._glue = false;
    apply._allowShortCircuit = false;
    apply._suboperators = [] as AsyncOperator<any, any, any, any>[];
    apply._subgraph = null as Graph<any, any> | null;
    apply._check = null as string | null;
    apply._doc = null as string | null;
    apply.glue = (value: boolean) => {
        apply._glue = value;
        return apply;
    };
    apply.allowShortCircuit = (value: boolean) => {
        apply._allowShortCircuit = value;
        return apply;
    };
    apply.bname = (value: string) => {
        apply.__name = value;
        return apply;
    };
    apply.suboperators = (operators: AsyncOperator<any, any, any, any>[]) => {
        apply._suboperators = operators;
        return apply;
    };
    apply.type = (value: string) => {
        apply.__type = value;
        return apply;
    };
    apply.subgraph = (value: Graph<any, any> | null) => {
        apply._subgraph = value;
        return apply;
    }
    apply.check = (value: string | null) => {
        apply._check = value;
        return apply;
    };
    apply.doc = (value: string) => {
        apply._doc = value;
        return apply;
    };
    if ((func as Graph<any, any>).__type === "Graph") {
        apply._subgraph = func as Graph<any, any>;
    }
    return apply;
};

export interface Branch<A, B, C, R> {
    readonly elseif: (check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>) => Branch<A, B, C, R>,
    readonly else: (func: AsyncParams<A, B, C, R>) => EndBranch<A, B, C, R>,
    readonly end: (name: string) => AsyncOperator<A, B, C, R>
}

interface EndBranch<A, B, C, R> {
    readonly end: (name: string) => AsyncOperator<A, B, C, R>
}

const FAILED_CHECK = {};
const _if = <A, B, C, R>(check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>): Branch<A, B, C, R> => {
    const funcs: AsyncOperator<A, B, C, R>[] = [];
    const name = (func as any).__name || func.name;
    const apply = _operator(async (a: A, context: C) => {
        if (check(a, context)) {
            return await func(a, context);
        } else {
            return Promise.resolve(FAILED_CHECK);
        }
    })
      .bname(name)
      .check(check.name || check.toString())
      .subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, B, C, R>;
    funcs.push(apply);
    const _elseif = (check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>) => {
        const name = (func as any).__name || func.name;
        const apply = _operator(async (a: A, context: C) => {
            if (check(a, context)) {
                return await func(a, context);
            } else {
                return Promise.resolve(FAILED_CHECK);
            }
        })
          .bname(name)
          .check(check.name || check.toString())
          .subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, B, C, R>;
        funcs.push(apply);
        return {
            elseif: _elseif,
            else: _else,
            end: _end
        }
    };
    const _else = (func: AsyncParams<A, B, C, R>) => {
        const name = (func as any).__name || func.name;
        const apply = _operator(async (a: A, context: C) => {
            return await func(a, context);
        })
          .bname(name)
          .check(check.name || check.toString())
          .subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, B, C, R>;
        funcs.push(apply);
        return {
            end: _end
        }
    };
    const _end = (name: string): AsyncOperator<A, B, C, R> => {
        const apply: ShortcircuitAsyncFunc<A, B, C, R> = async (a: A, context: C) => {
            let result: B | End<R>;
            for (const cur of funcs) {
                result = await cur(a, context)
                if (result !== FAILED_CHECK) {
                    return result;
                }
            }
            throw new Error("No branch was taken");
        }
        return _operator(apply).suboperators(funcs).type("BranchOperator").bname(name);
    };
    return {
        elseif: _elseif,
        else: _else,
        end: _end
    };
};

const parallel = <A, B, C, R>(func0: AsyncParams<A, B, C, R>, func1: AsyncParams<A, B, C, R>): AsyncOperator<A, [B, B], C, R> => {
    const name0 = (func0 as any).__name || func0.name;
    const name1 = (func1 as any).__name || func1.name;
    const apply = async (a: A, context: C): Promise<[B, B] | End<R>> => {
        const [r0, r1] = await Promise.all([func0(a, context), func1(a, context)]);
        if ((r0 as End<R>).__type === "END") {
            return r0 as End<R>;
        }
        if ((r1 as End<R>).__type === "END") {
            return r1 as End<R>;
        }
        return [r0 as B, r1 as B] as [B, B];
    };
    const o0 = _operator(func0).bname(name0);
    const o1 = _operator(func1).bname(name1);
    return _operator(apply)
        .bname(`${name0}_${name1}`)
        .type("ParallelOperator")
        .suboperators([o0, o1]) as AsyncOperator<A, [B, B], C, R>;
};

function graph<A, B, C>(name: string, context: C, o0: AsyncOperator<A, B, C, B>): Graph<A, B>;
function graph<A, B, C, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, C>, o1: AsyncOperator<B, C, Context, C>): Graph<A, C>;
function graph<A, B, C, D, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, D>, o1: AsyncOperator<B, C, Context, D>, o2: AsyncOperator<C, D, Context, D>): Graph<A, D>;
function graph<A, B, C, D, E, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, E>, o1: AsyncOperator<B, C, Context, E>, o2: AsyncOperator<C, D, Context, E>, o3: AsyncOperator<D, E, Context, E>): Graph<A, E>;
function graph<A, B, C, D, E, F, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, F>, o1: AsyncOperator<B, C, Context, F>, o2: AsyncOperator<C, D, Context, F>, o3: AsyncOperator<D, E, Context, F>, o4: AsyncOperator<E, F, Context, F>): Graph<A, F>;
function graph<A, B, C, D, E, F, G, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, G>, o1: AsyncOperator<B, C, Context, G>, o2: AsyncOperator<C, D, Context, G>, o3: AsyncOperator<D, E, Context, G>, o4: AsyncOperator<E, F, Context, G>, o5: AsyncOperator<F, G, Context, G>): Graph<A, G>;

function graph(): Graph<unknown, unknown> {
  const name = arguments[0];
  const context = arguments[1];
  const operators = [] as any[];
  for (let i = 2; i < arguments.length; i++) {
    operators.push(arguments[i]);
  }
  const apply = async (a: unknown) => {
    const ret = await operators.reduce(async (value, operator) => {
      const v = await value;
      if (v && (v as End<unknown>).__type === "END") {
        return Promise.resolve(v);
      }
      return await operator(v, context);
    }, Promise.resolve(a));
    if (ret && (ret as End<unknown>).__type === "END") {
      return ret.value;
    }
    return ret;
  };
  apply.__type = "Graph";
  apply.__name = name;
  apply.__operators = operators;
  return apply;
}

const end = <R>(r: R): End<R> =>
    ({__type: "END", value: r});

const operator = {
    tap,
    operator: _operator,
    parallel,
    if: _if
};

const core = {
    operator,
    graph,
    end
};
export default core;
