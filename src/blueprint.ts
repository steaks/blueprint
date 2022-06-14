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
    readonly glue: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly allowShortCircuit: (value: boolean) => AsyncOperator<A, B, C, R>;
    readonly bname: (value: string) => AsyncOperator<A, B, C, R>;
}

type Operator<A, B, C, R> = AsyncOperator<A, B, C, R>

export interface Graph<A, B> {
    (a: A): Promise<B>;
    readonly __name: string;
    readonly __operators: Operator<any, any, any, any>[];
}

export type Sheet = {
    name: string,
    graph: {name: string, type: string}[]
}[];

const sync = <A, B, C, R>(func: SyncFunc<A, B, C, R>): AsyncOperator<A, B, C, R> => {
    const apply = (a: A, context: C) => Promise.resolve(func(a, context));
    return async<A, B, C, R>(apply).bname(func.name);
};

const tap = <A, C>(func: TapFunc<A, C>): AsyncOperator<A, A, C, unknown> => {
    const apply = (a: A, context: C) => {
        func(a, context);
        return Promise.resolve(a);
    };
    return async<A, A, C, unknown>(apply).bname(func.name);
};

const async = <A, B, C, R>(func: AsyncParams<A, B, C, R>): AsyncOperator<A, B, C, R> => {
    const name = func.name;
    const apply = async (a: A, context: C) =>
        await func(a, context)
    apply.__name = name;
    apply.__type = "Operator";
    apply._glue = false;
    apply._allowShortCircuit = false;
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
    const funcs: ((a: A, C: C) => Promise<any>)[] = [];
    const apply = async (a: A, context: C) => {
        if (check(a, context)) {
            executed = true;
            result = await func(a, context);
        }
    }
    funcs.push(apply);
    const _elseif = (check: (a: A, context: C) => boolean, func: AsyncParams<A, B, C, R>) => {
        const apply = async (a: A, context: C) => {
            if (!executed && check(a, context)) {
                executed = true;
                return await func(a, context);
            }
        }
        funcs.push(apply);
        return {
            elseif: _elseif,
            else: _else,
            end: _end
        }
    };
    const _else = (func: AsyncParams<A, B, C, R>) => {
        const apply = async (a: A, context: C) => {
            if (!executed) {
                executed = true;
                return await func(a, context);
            }
        }
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
        return async(apply);
    };
    return {
        elseif: _elseif,
        else: _else,
        end: _end
    };
};


const graph1 = <A, B, C>(name: string, context: C, o0: Operator<A, B, C, B>): Graph<A, B> => {
    const apply = async (a: A) => {
        const b = await o0(a, context);
        if ((b as End<B>).__type === "END") {
            return (b as End<B>).value;
        }
        return b as B;
    };
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
    apply.__name = name;
    apply.__operators = [o0, o1, o2];
    return apply;
};

const end = <R>(r: R): End<R> =>
    ({__type: "END", value: r});

const sheet = (graphs: Graph<any, any>[]): Sheet => {
    return graphs.map(g => {
        const graph = g.__operators.map(o => ({name: o.__name, type: o.__type}));
        return {name: g.__name, graph};
    });

};

const operator = {
    tap,
    sync,
    async,
    if: _if
};

const blueprint = {
    operator,
    graph1,
    graph2,
    graph3,
    sheet,
    end
};
export default blueprint;