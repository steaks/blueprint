export type Func0<R> = () => R | Promise<R>;
export type Func1<A0, R> = (a0: A0) => R | Promise<R>;
export type Func2<A0, A1, R> = (a0: A0, a1: A1) => R | Promise<R>;
export type Func3<A0, A1, A2, R> = (a0: A0, a1: A1, a2: A2) => R | Promise<R>;
export type Func4<A0, A1, A2, A3, R> = (a0: A0, a1: A1, a2: A2, a3: A3) => R | Promise<R>;

export interface Context {
  readonly graph: string;
  readonly data: Record<string, any>;
}

export interface Operator<R> {
    (context: Context): Promise<R>;
    readonly __name: string;
    readonly __type: string;
    readonly _suboperators: Operator<any>[];
    readonly _subgraph: Graph<any, any> | null;
}

export interface Graph<A, B> {
    (a: A): Promise<B>;
    readonly __type: string;
    readonly __name: string;
    readonly _operators: Operator<any>[];
    readonly _input: string;
    readonly _output: string;
}

export type Case0<B> = (check: () => boolean, func: Func0<B>) => Branch0<B>;
export type Case1<A0, B> = (check: (a0: A0) => boolean, func: Func1<A0, B> | Graph<A0, B>) => Branch1<A0, B>;

export interface Branch0<B> {
  readonly __name: string;
  readonly __cases: {check: () => boolean, func: Func0<B>}[];
  readonly __default?: () => B | Promise<B>;
  readonly case: Case0<B>;
  readonly default: (func: () => B | Promise<B>) => Operator<B>;
}

export interface Branch1<A0, B> {
  readonly __name: string;
  readonly __cases: {check: (a0: A0) => boolean, func: Func1<A0, B>}[];
  readonly __default?: Func1<A0, B>;
  readonly case: Case1<A0, B>;
  readonly default: (func: Func1<A0, B>) => Operator<B>;
}

export interface OperatorJSON {
    readonly name: string;
    readonly type: string;
    readonly suboperators: OperatorJSON[];
    readonly subgraph: string | null;
}

export interface GraphJSON {
    readonly name: string;
    readonly operators: OperatorJSON[];
}

export interface SheetJSON {
    name: string,
    graphs: GraphJSON[]
}