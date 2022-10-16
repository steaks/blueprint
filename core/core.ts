/* eslint-disable max-len */

import {getParamNames} from "./util";
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

export interface AsyncOperator<A, B, C extends BaseContext, R> {
    (p: A, context: C): Promise<B | End<R>>;
    readonly __name: string;
    readonly __type: string;
    readonly _suboperators: AsyncOperator<any, any, any, any>[];
    readonly _subgraph: Graph<any, any> | null;
    readonly _check: string | null;
    readonly _doc: string | null;
    readonly _path: string | null;
    readonly _log: boolean;
    readonly _time: boolean;
    readonly _input: string;
    readonly glue: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly allowShortCircuit: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly bname: (value: string) => AsyncOperator<A, B, C, R>;
    readonly input: (value: string) => AsyncOperator<A, B, C, R>;
    readonly suboperators: (value: AsyncOperator<any, any, any, any>[]) => AsyncOperator<A, B, C, R>;
    readonly subgraph: (value: Graph<any, any> | null) => AsyncOperator<A, B, C, R>;
    readonly check: (value: string) => AsyncOperator<A, B, C, R>;
    readonly type: (value: string) => AsyncOperator<A, B, C, R>;
    readonly doc: (value: string) => AsyncOperator<A, B, C, R>
    readonly log: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly time: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly plugins: (plugins: string[]) => AsyncOperator<A, B, C, R>;
}

type Operator<A, B, C extends BaseContext, R> = AsyncOperator<A, B, C, R>

export interface Graph<A, B> {
    (a: A): Promise<B>;
    readonly __type: string;
    readonly __name: string;
    readonly _input: string;
    readonly _output: string;
    readonly _doc: string | null;
    readonly __operators: Operator<any, any, any, any>[];
    readonly doc: (value: string) => Graph<A, B>
}

const log = (context: BaseContext, message: string, ...optionalParams: any[]) => {
  console.log(context.graph, context.operator, message, ...optionalParams);
};

const error = (context: BaseContext, message?: any, ...optionalParams: any[]) => {
  console.error(context.graph, context.operator, message, ...optionalParams);
};

const tap = <A, C extends BaseContext>(func: TapParams<A, C>): AsyncOperator<A, A, C, any> => {
    const input = getParamNames(func)[0];
    const apply = (a: A, context: C) => {
        func(a, context);
        return Promise.resolve(a);
    };
    return _operator<A, A, C, unknown>(apply)
      .bname(func.name)
      .input(input)
      .subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, A, C, unknown>;
};

const isGraph = (func: AsyncParams<any,any,any,any>): func is Graph<any, any> =>
  (func as Graph<any, any>).__type === "Graph";

const plugins = {} as Record<string, {readonly before: (a: any, context: any) => void; readonly after: (a: any, context: any) => void;}>;

const _operator = <A, B, C extends BaseContext, R>(func: AsyncParams<A, B, C, R>): AsyncOperator<A, B, C, R> => {
    const name = (func as any).__name || func.name;
    const input = (func as any)._input || getParamNames(func)[0]
    const apply = async (a: A, context: C) => {
      try {
        const time = Date.now();
        if (apply._log) {
          log(context, "input", a);
        }
        apply._plugins.forEach((p) => {
          const plugin = plugins[p];
          if (plugin) {
            plugin.after(a, context);
          }
        });
        const ret = await func(a, context);
        if (apply._log) {
          log(context, "output", ret);
        }
        if (apply._time) {
          log(context, "time", Date.now() - time);
        }
        apply._plugins.forEach((p) => {
          const plugin = plugins[p];
          if (plugin) {
            plugin.after(a, context);
          }
        });
        return ret;
      } catch (e) {
        error(context, e);
        throw e;
      }
    };
    apply.__name = name;
    apply.__type = "Operator";
    apply._glue = false;
    apply._allowShortCircuit = false;
    apply._suboperators = [] as AsyncOperator<any, any, any, any>[];
    apply._subgraph = null as Graph<any, any> | null;
    apply._check = null as string | null;
    apply._doc = null as string | null;
    apply._log = false;
    apply._time = false;
    apply._input = input;
    apply._plugins = [] as string[];
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
    apply.input = (value: string) => {
        apply._input = value;
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
    apply.log = (value: boolean) => {
      apply._log = value;
      return apply;
    };
    apply.time = (value: boolean) => {
      apply._time = value;
      return apply;
    };
    apply.plugins = (plugins: string[]) => {
      apply._plugins = plugins;
      return apply;
    };
    apply.plugin = (plugin: string) => {
      apply._plugins.push(plugin);
      return apply;
    }
    if ((func as Graph<any, any>).__type === "Graph") {
        apply._subgraph = func as Graph<any, any>;
    }
    const stack = new Error().stack!
    const arr = stack.split("\n");
    const trace = arr.slice(1).find((s) =>
      !s.includes("blueprint/core/core.ts") &&
      !s.includes("blueprint/webserver/router.ts") &&
      !s.includes("blueprint/webserver/webserver.ts") &&
      s.includes("(/")
    );
    if (trace) {
      const start = trace.indexOf("/examples/citifakebank");
      const sub = trace.substring(start);
      const end = sub.lastIndexOf(":");
      if (start && end) {
        const path = sub.substring(0, end).replace(":", "#L");
        const fullPath = `https://github.com/steaks/blueprint/tree/main/webserver${path}`;
        apply._path = fullPath;
      } else {
        apply._path = null;
      }
    } else {
        apply._path = null;
    }
    return apply;
};

export interface Branch<A, B, C extends BaseContext, R> {
    readonly elseif: (check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>) => Branch<A, B, C, R>,
    readonly else: (func: AsyncParams<A, B, C, R>) => EndBranch<A, B, C, R>,
    readonly end: (name: string) => AsyncOperator<A, B, C, R>
}

interface EndBranch<A, B, C extends BaseContext, R> {
    readonly end: (name: string) => AsyncOperator<A, B, C, R>
}

const FAILED_CHECK = {};
const _if = <A, B, C extends BaseContext, R>(check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>): Branch<A, B, C, R> => {
    const funcs: AsyncOperator<A, B, C, R>[] = [];
    const input = getParamNames(check)[0];
    const name = (func as any).__name || func.name;
    const apply = _operator(async (a: A, context: C) => {
        if (check(a, context)) {
            return await func(a, context);
        } else {
            return Promise.resolve(FAILED_CHECK);
        }
    })
      .bname(name)
      .input(input)
      .check(check.name || check.toString())
      .subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, B, C, R>;
    funcs.push(apply);
    const _elseif = (check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>) => {
        const name = (func as any).__name || func.name;
        const input = getParamNames(check)[0];
        const apply = _operator(async (a: A, context: C) => {
            if (check(a, context)) {
                return await func(a, context);
            } else {
                return Promise.resolve(FAILED_CHECK);
            }
        })
          .bname(name)
          .input(input)
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
        const input = getParamNames(func)[0];
        const apply = _operator(async (a: A, context: C) => {
            return await func(a, context);
        })
          .bname(name)
          .input(input)
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
        return _operator(apply).suboperators(funcs).type("BranchOperator").bname(name).input(input);
    };
    return {
        elseif: _elseif,
        else: _else,
        end: _end
    };
};

const parallel = <A, B, C extends BaseContext, R>(func0: AsyncParams<A, B, C, R>, func1: AsyncParams<A, B, C, R>): AsyncOperator<A, [B, B], C, R> => {
    const name0 = (func0 as any).__name || func0.name;
    const name1 = (func1 as any).__name || func1.name;
    const input = getParamNames(func0)[0];
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
        .input(input)
        .type("ParallelOperator")
        .suboperators([o0, o1]) as AsyncOperator<A, [B, B], C, R>;
};

export interface BaseContext {
  readonly graph: string;
  readonly operator: string;
}

export interface With0<A> extends BaseContext {
  readonly 0: A
}

export interface With1<A, B = unknown> extends BaseContext {
  readonly 0: A
  readonly 1: B
}

export interface With2<A, B = unknown, C = unknown> extends BaseContext {
  readonly 0: A
  readonly 1: B
  readonly 2: C
}

export interface With3<A, B = unknown, C = unknown, D = unknown> extends BaseContext {
  readonly 0: A
  readonly 1: B
  readonly 2: C
  readonly 3: D
}

export interface With4<A, B = unknown, C = unknown, D = unknown, E = unknown> extends BaseContext {
  readonly 0: A
  readonly 1: B
  readonly 2: C
  readonly 3: D
  readonly 4: E
}

export interface With5<A, B = unknown, C = unknown, D = unknown, E = unknown, F = unknown> {
  readonly 0: A
  readonly 1: B
  readonly 2: C
  readonly 3: D
  readonly 4: E
  readonly 5: E
}

function graph<A, B, Context extends BaseContext>(
  name: string,
  o0: AsyncOperator<A, B, Context & With0<A>, B>,
  output: string
): Graph<A, B>;
function graph<A, B, C, Context extends BaseContext>(
  name: string,
  o0: AsyncOperator<A, B, Context & With0<A>, C>,
  o1: AsyncOperator<B, C, Context & With1<A, B>, C>,
  output: string
): Graph<A, C>;
function graph<A, B, C, D, Context extends BaseContext>(
  name: string,
  o0: AsyncOperator<A, B, Context & With0<A>, D>,
  o1: AsyncOperator<B, C, Context & With1<A, B>, D>,
  o2: AsyncOperator<C, D, Context & With2<A, B, C>, D>,
  output: string
): Graph<A, D>;
function graph<A, B, C, D, E, Context extends BaseContext>(
  name: string,
  o0: AsyncOperator<A, B, Context & With0<A>, E>,
  o1: AsyncOperator<B, C, Context & With1<A, B>, E>,
  o2: AsyncOperator<C, D, Context & With2<A, B, C>, E>,
  o3: AsyncOperator<D, E, Context & With3<A, B, C, D>, E>,
  output: string
  ): Graph<A, E>;
function graph<A, B, C, D, E, F, Context extends BaseContext>(
  name: string,
  o0: AsyncOperator<A, B, Context & With0<A>, F>,
  o1: AsyncOperator<B, C, Context & With1<A, B>, F>,
  o2: AsyncOperator<C, D, Context & With2<A, B, C>, F>,
  o3: AsyncOperator<D, E, Context & With3<A, B, C, D>, F>,
  o4: AsyncOperator<E, F, Context & With4<A, B, C, D, E>, F>,
  output: string
): Graph<A, F>;
function graph<A, B, C, D, E, F, G, Context extends BaseContext>(
  name: string,
  o0: AsyncOperator<A, B, Context & With0<A>, G>,
  o1: AsyncOperator<B, C, Context & With1<A, B>, G>,
  o2: AsyncOperator<C, D, Context & With2<A, B, C>, G>,
  o3: AsyncOperator<D, E, Context & With3<A, B, C, D>, G>,
  o4: AsyncOperator<E, F, Context & With4<A, B, C, D, E>, G>,
  o5: AsyncOperator<F, G, Context & With5<A, B, C, D, E, F>, G>,
  output: string
): Graph<A, G>;

function graph(): Graph<unknown, unknown> {
  const name = arguments[0];
  const operators = [] as any[];
  for (let i = 1; i < arguments.length - 1; i++) {
    operators.push(arguments[i]);
  }
  const input = operators[0]._input;
  const output = arguments[arguments.length - 1] as string;
  const context = {graph: name} as Record<string, any>;
  const apply = async (a: unknown) => {
    context["0"] = a;
    const ret = await operators.reduce(async (value, operator, i) => {
      const v = await value;
      if (v && (v as End<unknown>).__type === "END") {
        return Promise.resolve(v);
      }
      context.operator = operator.name;
      const result = await operator(v, context);
      context[i+1] = result;
      return result;
    }, Promise.resolve(a));
    if (ret && (ret as End<unknown>).__type === "END") {
      return ret.value;
    }
    return ret;
  };
  apply.__type = "Graph";
  apply.__name = name;
  apply.__operators = operators;
  apply._doc = null as null | string;
  apply._input = input;
  apply._output = output;
  apply.doc = (value: string) => {
    apply._doc = value;
    return apply
  };
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
    isGraph,
    graph,
    log,
    error,
    end
};
export default core;
