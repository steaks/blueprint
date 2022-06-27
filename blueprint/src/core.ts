/* eslint-disable max-len */

type SyncFunc<A, B, C, R> = (p: A, context: C) => B | End<R>;
type TapFunc<A, C> = (p: A, context: C) => any;
type AsyncFunc<A, B, C, R> = (p: A, context: C) => Promise<B | End<R>>;
type ShortcircuitAsyncFunc<A, B, C, R> = (p: A, context: C) => Promise<B | End<R>>;
type AsyncParams<A, B, C, R> = AsyncFunc<A, B, C, R> | Graph<A, B> | ShortcircuitAsyncFunc<A, B, C, R> | SyncFunc<A, B, C, R>;

//test test test

interface End<V> {
    __type: "END",
    value: V
}

interface AsyncOperator<A, B, C, R> {
    (p: A, context: C): Promise<B | End<R>>;
    readonly __name: string;
    readonly __type: string;
    readonly _suboperators: AsyncOperator<any, any, any, any>[];
    readonly _subgraph: Graph<any, any> | null;
    readonly glue: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly allowShortCircuit: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly bname: (value: string) => AsyncOperator<A, B, C, R>;
    readonly suboperators: (value: AsyncOperator<any, any, any, any>[]) => AsyncOperator<A, B, C, R>;
    readonly subgraph: (value: Graph<any, any> | null) => AsyncOperator<A, B, C, R>;
    readonly type: (value: string) => AsyncOperator<A, B, C, R>;
}

type Operator<A, B, C, R> = AsyncOperator<A, B, C, R>

export interface Graph<A, B> {
    (a: A): Promise<B>;
    readonly __type: string;
    readonly __name: string;
    readonly __operators: Operator<any, any, any, any>[];
}

const tap = <A, C>(func: TapFunc<A, C>): AsyncOperator<A, A, C, unknown> => {
    const apply = (a: A, context: C) => {
        func(a, context);
        return Promise.resolve(a);
    };
    return async<A, A, C, unknown>(apply).bname(func.name);
};

const async = <A, B, C, R>(func: AsyncParams<A, B, C, R>): AsyncOperator<A, B, C, R> => {
    const name = (func as any).__name || func.name;
    const apply = async (a: A, context: C) =>
        await func(a, context)
    apply.__name = name;
    apply.__type = "Operator";
    apply._glue = false;
    apply._allowShortCircuit = false;
    apply._suboperators = [] as AsyncOperator<any, any, any, any>[];
    apply._subgraph = null as Graph<any, any> | null;
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
    if ((func as Graph<any, any>).__type === "Graph") {
        apply._subgraph = func as Graph<any, any>;
    }
    return apply;
};

interface Branch<A, B, C, R> {
    readonly elseif: (check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>) => Branch<A, B, C, R>,
    readonly else: (func: AsyncParams<A, B, C, R>) => AsyncOperator<A, B, C, R>,
    readonly end: () => AsyncOperator<A, B, C, R>
}

const _if = <A, B, C, R>(check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>): Branch<A, B, C, R> => {
    let executed = false;
    let result: B | End<R>;
    const funcs: AsyncOperator<A, B, C, R>[] = [];
    const name = (func as any).__name || func.name;
    const apply = async(async (a: A, context: C) => {
        if (check(a, context)) {
            executed = true;
            result = await func(a, context);
            return result;
        }
    }).bname(name).subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, B, C, R>;
    funcs.push(apply);
    const _elseif = (check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>) => {
        const name = (func as any).__name || func.name;
        const apply = async(async (a: A, context: C) => {
            if (!executed && check(a, context)) {
                executed = true;
                return await func(a, context);
            }
        }).bname(name).subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, B, C, R>;
        funcs.push(apply);
        return {
            elseif: _elseif,
            else: _else,
            end: _end
        }
    };
    const _else = (func: AsyncParams<A, B, C, R>) => {
        const name = (func as any).__name || func.name;
        const apply = async(async (a: A, context: C) => {
            if (!executed) {
                executed = true;
                return await func(a, context);
            }
        }).bname(name).subgraph((func as any).__type === "Graph" ? func as Graph<any, any> : null) as unknown as AsyncOperator<A, B, C, R>;
        funcs.push(apply);
        return _end();
    };
    const _end = (): AsyncOperator<A, B, C, R> => {
        const apply: ShortcircuitAsyncFunc<A, B, C, R> = async (a: A, context: C) => {
            for (const cur of funcs) {
                await cur(a, context)
            }
            return result;
        }
        return async(apply).suboperators(funcs).type("BranchOperator");
    };
    return {
        elseif: _elseif,
        else: _else,
        end: _end
    };
};

const parallel = <A, B, C, R>(func0: AsyncParams<A, B, C, R>, func1: AsyncParams<A, B, C, R>): AsyncOperator<A, [B, B], C, R> => {
    const name0 = (func0 as any).__name || func0.name;
    const name1= (func1 as any).__name || func1.name;
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
    const o0 = async(func0).bname(name0);
    const o1 = async(func1).bname(name1);
    return async(apply)
        .bname(`${name0}_${name1}`)
        .type("ParallelOperator")
        .suboperators([o0, o1]) as AsyncOperator<A, [B, B], C, R>;
};


const graph1 = <A, B, C>(name: string, context: C, o0: Operator<A, B, C, B>): Graph<A, B> => {
    const apply = async (a: A) => {
        const b = await o0(a, context);
        if ((b as End<B>).__type === "END") {
            return (b as End<B>).value;
        }
        return b as B;
    };
    apply.__type = "Graph";
    apply.__name = name;
    apply.__operators = [o0];
    return apply;
};

const graph2 = <A, B, C, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, C>, o1: AsyncOperator<B, C, Context, C>): Graph<A, C> => {
    const apply = async (a: A) => {
        const b = await o0(a, context);
        if ((b as End<C>).__type === "END") {
            return (b as End<C>).value;
        }
        const c = await o1(b as B, context);
        if ((c as End<C>).__type === "END") {
            return (c as End<C>).value;
        }
        return c as C;
    };
    apply.__type = "Graph";
    apply.__name = name;
    apply.__operators = [o0, o1];
    return apply;
};

const graph3 = <A, B, C, D, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, D>, o1: AsyncOperator<B, C, Context, D>, o2: AsyncOperator<C, D, Context, D>): Graph<A, D> => {
    const apply = async (a: A) => {
        const b = await o0(a, context);
        if ((b as End<D>).__type === "END") {
            return (b as End<D>).value;
        }
        const c = await o1(b as B, context);
        if ((c as End<D>).__type === "END") {
            return (c as End<D>).value;
        }
        const d = await o2(c as C, context);
        if ((d as End<D>).__type === "END") {
            return (d as End<D>).value;
        }
        return d as D;
    };
    apply.__type = "Graph";
    apply.__name = name;
    apply.__operators = [o0, o1, o2];
    return apply;
};

const graph4 = <A, B, C, D, E, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, E>, o1: AsyncOperator<B, C, Context, E>, o2: AsyncOperator<C, D, Context, E>, o3: AsyncOperator<D, E, Context, E>): Graph<A, E> => {
    const apply = async (a: A) => {
        const b = await o0(a, context);
        if ((b as End<E>).__type === "END") {
            return (b as End<E>).value;
        }
        const c = await o1(b as B, context);
        if ((c as End<E>).__type === "END") {
            return (c as End<E>).value;
        }
        const d = await o2(c as C, context);
        if ((d as End<E>).__type === "END") {
            return (d as End<E>).value;
        }
        const e = await o3(d as D, context);
        if ((e as End<E>).__type === "END") {
            return (e as End<E>).value;
        }
        return e as E;
    };
    apply.__type = "Graph";
    apply.__name = name;
    apply.__operators = [o0, o1, o2, o3];
    return apply;
};

const graph5 = <A, B, C, D, E, F, Context>(name: string, context: Context, o0: AsyncOperator<A, B, Context, F>, o1: AsyncOperator<B, C, Context, F>, o2: AsyncOperator<C, D, Context, F>, o3: AsyncOperator<D, E, Context, F>, o4: AsyncOperator<E, F, Context, F>): Graph<A, F> => {
    const apply = async (a: A) => {
        const b = await o0(a, context);
        if ((b as End<F>).__type === "END") {
            return (b as End<F>).value;
        }
        const c = await o1(b as B, context);
        if ((c as End<F>).__type === "END") {
            return (c as End<F>).value;
        }
        const d = await o2(c as C, context);
        if ((d as End<F>).__type === "END") {
            return (d as End<F>).value;
        }
        const e = await o3(d as D, context);
        if ((e as End<F>).__type === "END") {
            return (e as End<F>).value;
        }
        const f = await o4(e as E, context);
        if ((f as End<F>).__type === "END") {
            return (f as End<F>).value;
        }
        return f as F;
    };
    apply.__type = "Graph";
    apply.__name = name;
    apply.__operators = [o0, o1, o2, o3, o4];
    return apply;
};

const end = <R>(r: R): End<R> =>
    ({__type: "END", value: r});

const operator = {
    tap,
    async,
    parallel,
    if: _if
};

const core = {
    operator,
    graph1,
    graph2,
    graph3,
    graph4,
    graph5,
    end
};
export default core;