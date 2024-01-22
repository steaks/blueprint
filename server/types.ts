import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {Server, Socket} from "socket.io";
import express, {NextFunction} from "express";
import http from "http";

export type Func0<R> = () => R | Promise<R>;
export type Func1<A0, R> = (a0: A0) => R | Promise<R>;
export type Func2<A0, A1, R> = (a0: A0, a1: A1) => R | Promise<R>;
export type Func3<A0, A1, A2, R> = (a0: A0, a1: A1, a2: A2) => R | Promise<R>;
export type Func4<A0, A1, A2, A3, R> = (a0: A0, a1: A1, a2: A2, a3: A3) => R | Promise<R>;

export interface Event {
  readonly __type: "Event";
  readonly __name: string;
  readonly create: (app: AppContext | SessionContext) => void;
  readonly destroy: (app: AppContext | SessionContext) => void;
}

export interface RefParam<V> {
  readonly __type: "StateRefParam" | "EventRefParam" | "TaskRefParam";
  readonly ref: State<V> | Event | Task<V>;
}

export interface StateRef<V> {
  readonly __type: "StateRef";
  readonly _next: (v: V) => void;
  readonly _getValue: () => V;
}

export interface EventRef {
  readonly __type: "EventRef";
  readonly _next: () => void;
}

export interface TaskRef<V> {
  readonly __type: "TaskRef";
  readonly _next: () => void;
  readonly _getValue: () => V;
}

export interface State<V> {
  readonly __type: "State";
  readonly __name: string;
  readonly create: (app: AppContext | SessionContext) => void;
  readonly destroy: (app: AppContext | SessionContext) => void;
}

export interface RxOperator<V> {
  (app: AppContext, session: SessionContext, context: Context): Promise<V>;
  readonly __name: string;
  readonly __type: string;
  readonly _suboperators: Operator<any>[];
  readonly _subgraph: Graph<any, any> | null;
  readonly _stateInputs: State<unknown>[];
  readonly _taskInputs: Task<unknown>[];
}

export interface TriggerOperator<V> extends RxOperator<V> {
  readonly __type: "TriggerOperator";
}

export interface TaskOptions {
  readonly name: string;
  readonly triggers?: (State<unknown> | Event | "self" | "stateChanges")[];
}

export interface Task<V> {
  __type: string;
  __name: string;
  _operators: RxOperator<any>[];
  _input: string;
  _output: string;
  _outputState: State<V>;
  _trigger: Event | null;
  _triggers: (Event | State<any>)[];
  _inputs: State<any>[];
  create: (context: AppContext, session: SessionContext) => void;
  destroy: (context: AppContext, session: SessionContext) => void;
}

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

export interface TriggerJSON {
  readonly name: string;
}

export interface InputJSON {
  readonly name: string;
}

export interface GraphJSON {
  readonly name: string;
  readonly operators: OperatorJSON[];
  readonly triggers?: TriggerJSON[];
  readonly inputs?: InputJSON[];
}

interface StateJSON {
  readonly name: string;
}

interface EventJSON {
  readonly name: string;
}

export interface SheetJSON {
  name: string,
  graphs: GraphJSON[]
  states?: StateJSON[];
  events?: EventJSON[];
}

export interface SlimSheetJSON {
  readonly name: string;
}

export interface AppContext {
  readonly __id: string;
  readonly __socketId: string;
  readonly __name: string;
  readonly __state: Record<string, BehaviorSubject<any>>;
  readonly __events: Record<string, Subject<any>>;
  readonly __tasks: Record<string, Observable<any>>;
  readonly __requests$: Subject<BlueprintRequest>;
  __requestSubscription?: Subscription;
  __lastRequestId: number;
}

export interface BlueprintRequest {
  readonly __type: "event" | "state" | "task";
  readonly name: string;
  readonly payload: any;
  readonly id: number;
  readonly count: number;
}

export interface SessionContext {
  readonly __id: string;
  readonly __socketId: string;
  readonly __name: string;
  readonly __state: Record<string, BehaviorSubject<any>>;
  readonly __events: Record<string, Subject<any>>;
  readonly __tasks: Record<string, Observable<any>>;
  readonly __requests$: Subject<BlueprintRequest>
}

export interface AppBlueprint {
  readonly name: string;
  readonly state: State<any>[];
  readonly events: Event[];
  readonly tasks: Task<any>[];
}

export interface Session {
  readonly state: Record<string, State<any>>;
  readonly events: Record<string, Event>;
  readonly tasks: Record<string, Task<any>>;
}

export interface RxBlueprintServer {
  readonly sockets: Record<string, Socket>;
  readonly routes: {
    post: Record<string, Function>;
  };
  readonly sessions: Record<string, SessionContext>;
  readonly apps: Record<string, AppContext>;
}

export interface App {
  readonly __app: AppBlueprint;
  readonly __sheet: SheetJSON;
  readonly create: (socketId: string) => void;
  readonly destroy: (socketId: string) => void;
}

export interface ServerOptions {
  readonly cors?: Cors;
  readonly port?: number;
}
export interface Cors {
  readonly origin?: string;
}
export interface BlueprintExpress {
  readonly path: string;
  readonly app: express.Application;
  readonly serve: (options?: ServerOptions) => http.Server;
}

export interface BlueprintIO {
  readonly namespace: string;
  readonly onConnection: (socket: Socket) => void;
  readonly serve: (server: http.Server, options?: ServerOptions) => Server;
}

export interface Servers {
  readonly expressServer: http.Server;
  readonly ioServer: Server;
}

export interface Blueprint {
  readonly express: BlueprintExpress;
  readonly io: BlueprintIO;
  readonly serve: (options?: ServerOptions) => Servers;
}

export interface Serialized {
  readonly name: string;
  readonly sheets: SheetJSON[];
  readonly slimSheets: SlimSheetJSON[];
}