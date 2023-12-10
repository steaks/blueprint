import {
  BehaviorSubject,
  catchError,
  combineLatest,
  delay,
  filter,
  map,
  merge,
  of,
  Subject,
  switchMap,
  tap,
  withLatestFrom
} from "rxjs";
import {
  Context,
  Func0,
  Func1,
  Func2,
  Func3,
  Func4,
  Graph,
  RxOperator,
  State,
  Event,
  Task,
  TaskOptions,
  Session,
  SessionContext,
  AppContext,
  AppBlueprint,
  App,
  RxBlueprintServer,
  ServerOptions,
  RefParam, StateRef, TaskRef, EventRef, TriggerOperator
} from "../types";
import minimist from "minimist";
import {randomUUID} from "crypto";
import http, {IncomingMessage, ServerResponse} from "http";
import * as qs from "qs";
import parseurl from "parseurl";
import {Url} from "url";
import _ from "lodash";
import express, {Request} from "express";
import cors from "cors";
import {Server} from "socket.io";
import rxserialize from "./rxserialize";
import util from "./util";
import bodyParser from "body-parser";

interface RxContext {
  readonly graph: string;
  readonly data: Record<string, any>;
  readonly state: Record<string, BehaviorSubject<any>>;
}

const isEvent = (v: any): v is Event =>
  (v as any).__type === "Event";
export const event = (name: string): Event =>
  ({
    __type: "Event", __name: name, create: (app: AppContext | SessionContext) => {
      app.__events[name] = new Subject<string>();
    }
  });

const isState = (v: any): v is State<any> =>
  (v as any).__type === "State";

const isOperator = (v: any): v is RxOperator<any> =>
  (v as any).__type === "Operator";

const isRefParam = (v: any): v is RefParam<any> =>
  (v as any).__type === "StateRefParam" ||
  (v as any).__type === "EventRefParam" ||
  (v as any).__type === "TaskRefParam";

const isTask = (v: any): v is Task<any> =>
  (v as any).__type === "Task";

const nonce = {};
export const state = <V>(name: string, initialValue?: V): State<V> => {
  return {
    __type: "State",
    __name: name,
    create: (app: AppContext | SessionContext) => {
      app.__state[name] = initialValue !== undefined ? new BehaviorSubject(initialValue) : new BehaviorSubject(nonce as unknown as V);
    }
  };
};


export function task<A>(o0: RxOperator<A>): Task<A>;
export function task<A>(options: TaskOptions, o0: RxOperator<A>): Task<A>;
export function task<A>(name: string, options: TaskOptions, o0: RxOperator<A>): Task<A>;
export function task<A>(name: string, options: TaskOptions, o0: RxOperator<A>, o1: TriggerOperator<any>): Task<A>;
export function task<A>(name: string, options: TaskOptions, o0: RxOperator<A>, o1: TriggerOperator<any>, o2: TriggerOperator<any>): Task<A>;
export function task<A>(name: string, options: TaskOptions, o0: RxOperator<A>, o1: TriggerOperator<any>): Task<A>;
export function task<A>(name: string, options: TaskOptions, o0: RxOperator<A>, o1: TriggerOperator<any>, o2: TriggerOperator<any>, o3: TriggerOperator<any>, o4: TriggerOperator<any>): Task<A>;
export function task(): Task<any> {
  let name: string;
  let options: TaskOptions;
  let operators: RxOperator<any>[];
  if (arguments.length === 1) {
    options = {} as TaskOptions
    operators = util.createArgs(arguments, 0) as RxOperator<any>[];
    name = operators[0].__name;
  } else if (arguments.length === 2) {
    options = arguments[0] as TaskOptions
    operators = util.createArgs(arguments, 1) as RxOperator<any>[];
    name = operators[0].__name;
  } else {
    name = arguments[0] as string;
    options = arguments[1] as TaskOptions
    operators = util.createArgs(arguments, 2) as RxOperator<any>[];
  }

  const optTriggers = options.triggers || ["self", "stateChanges"];
  const context = {graph: name, data: {}, state: {}} as RxContext;
  const taskEvent = optTriggers.includes("self") ? event(`trigger_${name}`) : null;
  const taskState = state<any>(`task_${name}`);
  const _inputStates = optTriggers.includes("stateChanges")
    ? [
      ...operators.flatMap(o => o._stateInputs),
      ...operators.flatMap(o => o._taskInputs.flatMap(h => h._outputState))]
    : [];
  const _optionStates = optTriggers.filter(t => isState(t)) as State<any>[];
  const _states = _.chain([..._inputStates, ..._optionStates]).uniqBy(s => s.__name).value();
  const _initialized = optTriggers.includes("stateChanges") && _states.length === 0 ? [event("initialized")] : [];
  const _allTriggers = [
    ..._inputStates,
    ...optTriggers.filter(t => isState(t) || isEvent(t)) as (State<any> | Event)[],
    ..._initialized
  ]
  const triggerNames = new Set(_allTriggers.map(t => t.__name));
  const _allInputs = operators.flatMap(o => o._stateInputs).filter(i => !triggerNames.has(i.__name));
  const create = (app: AppContext, session: SessionContext): void => {
    if (!session) {
      console.log("HERE");
    }
    taskState.create(app);
    if (taskEvent) {
      taskEvent.create(app);
    }
    const operations = operators.map(op => switchMap(async () => {
      const ret = await op(app, session, context);
      context.data[op.__name] = ret;
      return ret;
    }));
    const inputStates = optTriggers.includes("stateChanges")
      ? [
        ...operators.flatMap(o => o._stateInputs),
        ...operators.flatMap(o => o._taskInputs.flatMap(h => h._outputState))
      ]
      : [];
    const optionStates = optTriggers.filter(isState) as State<any>[];
    const states = _
      .chain([...inputStates, ...optionStates])
      .uniqBy(s => s.__name)
      .map(s => app.__state[s.__name] || session.__state[s.__name])
      .value();
    const _taskEvent = taskEvent ? [taskEvent] : [];
    const optionEvents = optTriggers.filter(isEvent);
    const events = _
      .chain([...optionEvents, ..._taskEvent])
      .uniqBy(e => e.__name)
      .map(e => app.__events[e.__name] || session.__events[e.__name])
      .value();
    const initialized = optTriggers.includes("stateChanges") ? [app.__events["initialized"]] : [];
    const triggers = [...states, ...events, ...initialized];
    if (states.length) {
      const lastestStates$ = combineLatest(states).pipe(filter(v => !_.find(v, vv => vv === nonce)));
      app.__tasks[name] = merge(...triggers).pipe(
        map(e => {
          console.log(name, e);
          return "";
        }),
        withLatestFrom(lastestStates$),
        operations[0],
        operations[1] ? operations[1] : tap(_.identity),
        operations[2] ? operations[2] : tap(_.identity),
        operations[3] ? operations[3] : tap(_.identity),
        operations[4] ? operations[4] : tap(_.identity),
        operations[5] ? operations[5] : tap(_.identity),
        catchError(e => {
          console.error(e);
          return of({__type: "Error"});
        })
      );
    } else {
      app.__tasks[name] = merge(...triggers).pipe(
        map(e => {
          console.log(name, e);
          return "";
        }),
        operations[0],
        operations[1] ? operations[1] : tap(_.identity),
        operations[2] ? operations[2] : tap(_.identity),
        operations[3] ? operations[3] : tap(_.identity),
        operations[4] ? operations[4] : tap(_.identity),
        operations[5] ? operations[5] : tap(_.identity),
        catchError(e => {
          console.error(e);
          return of({__type: "Error"});
        }),
      );
    }
  };
  return {
    __name: name,
    __type: "Task",
    _operators: operators,
    _triggers: _allTriggers,
    _inputs: _allInputs,
    _output: operators[operators.length - 1].__name,
    _outputState: taskState,
    _trigger: taskEvent,
    _input: "None",
    create
  };
}

export const ref = <V>(v: State<V> | Event | Task<V>): RefParam<V> => {
  if (isState(v)) {
    return {__type: "StateRefParam", ref: v};
  } else if (isEvent(v)) {
    return {__type: "EventRefParam", ref: v}
  } else if (isTask(v)) {
    return {__type: "TaskRefParam", ref: v}
  }
  throw new Error("Unrecognized type");
};

export function from<R>(func: Func0<R>): RxOperator<R>;
export function from<A0, R>(func: Func1<A0, R>, arg0: RxOperator<A0> | State<A0> | Task<A0> | RefParam<A0>): RxOperator<R>;
export function from<A0, A1, R>(func: Func2<A0, A1, R>, arg0: RxOperator<A0> | State<A0> | Task<A0> | RefParam<A0>, arg1: RxOperator<A1> | State<A1> | Task<A1> | RefParam<A1>): RxOperator<R>;
export function from<A0, A1, A2, R>(func: Func3<A0, A1, A2, R>, arg0: RxOperator<A0> | State<A0> | Task<A0> | RefParam<A0>, arg1: RxOperator<A1> | State<A1> | Task<A1> | RefParam<A1>, arg2: RxOperator<A2> | State<A2> | Task<A2> | RefParam<A2>): RxOperator<R>;
export function from<A0, A1, A2, A3, R>(func: Func4<A0, A1, A2, A3, R>, arg0: RxOperator<A0> | State<A0> | Task<A0> | RefParam<A0>, arg1: RxOperator<A1> | State<A1> | Task<A1> | RefParam<A1>, arg2: RxOperator<A2> | State<A2> | Task<A2> | RefParam<A2>, arg3: RxOperator<A3> | State<A3> | Task<A3> | RefParam<A3>): RxOperator<R>;
export function from(): RxOperator<unknown> {
  const func = arguments[0];
  const args = util.createArgs(arguments, 1);
  const stateInputs = args.filter(isState)
  const taskInputs = args.filter(isTask)
  // const theOperator = createOperator(func, args);
  const theOperator = async (app: AppContext, session: SessionContext, c: Context): Promise<unknown> => {
    const a = args.map(a => {
      if (isState(a)) {
        return (app.__state[a.__name] || session.__state[a.__name]).getValue();
      } else if (isRefParam(a)) {
        if (a.__type === "StateRefParam") {
          const behaviorSubject = (app.__state[a.ref.__name] || session.__state[a.ref.__name]);
          return {
            __type: "StateRef",
            _next: (v: any) => behaviorSubject.next(v),
            _getValue: () => behaviorSubject.getValue()
          };
        }
        if (a.__type === "EventRefParam") {
          const subject = (app.__events[a.ref.__name] || session.__events[a.ref.__name]);
          return {__type: "EventRef", _next: () => subject.next("")};
        }
        if (a.__type === "TaskRefParam") {
          const subject = (app.__events[`trigger_${a.ref.__name}`] || session.__events[`trigger_${a.ref.__name}`]);
          const behaviorSubject = (app.__state[`task_${a.ref.__name}`] || session.__state[`task_${a.ref.__name}`]);
          return {__type: "TaskRef", _next: () => subject.next(""), _getValue: () => behaviorSubject.getValue()};
        }
      } else if (isTask(a)) {
        return (app.__state[`task_${a.__name}`] || session.__state[`task_${a.__name}`]).getValue();
      }
      return c.data[a.__name];
    });
    const ret = await Promise.resolve(func.apply(null, a));
    c.data[func.name] = ret;
    return ret;
  };
  theOperator.__name = func.__name || func.name;
  theOperator.__type = "Operator";
  theOperator._suboperators = util.emptySubOperators();
  theOperator._subgraph = util.isGraph(func) ? func : util.emptySubGraph();
  theOperator._stateInputs = stateInputs;
  theOperator._taskInputs = taskInputs;
  return theOperator;
}

const createSession = (session: Session, socketId: string): SessionContext => {
  const context = {
    __id: randomUUID(),
    __socketId: socketId,
    __name: "session",
    __state: {},
    __events: {},
    __tasks: {}
  } as SessionContext;
  _.forEach(session.state, s => {
    s.create(context);
  });
  _.forEach(session.events, e => {
    e.create(context);
  });
  _.forEach(session.tasks, h => {
    h.create({} as AppContext, context);
  });
  return context;
};

export const app = (func: () => AppBlueprint): App => {
  const theApp = func();
  theApp.events.push(event("initialized"));
  const create = (server: RxBlueprintServer, socketId: string) => {
    const context = {
      __id: randomUUID(),
      __socketId: socketId,
      __name: theApp.name,
      __state: {},
      __events: {},
      __tasks: {}
    } as AppContext;
    const socket = server.sockets[socketId];
    const session = server.sessions[socketId];
    theApp.state.forEach(s => {
      s.create(context);
      const route = `/${socketId}/${theApp.name}/${s.__name}`;
      const func = (req: Request) => {
        const value = req.body;
        context.__state[s.__name].next(value);
      };
      server.routes.post[route] = func;
      //TODO - fix race conditions properly
      const withDelay$ = context.__state[s.__name].pipe(delay(300));
      withDelay$.subscribe({
        next: v => {
          if (v !== nonce) {
            console.log(`${socketId}/${theApp.name}/${s.__name}`, v);
            socket.emit(`${theApp.name}/${s.__name}`, v);
          }
        },
        error: e => {
          console.error(e);
        }
      });
    });
    theApp.events.forEach(e => {
      e.create(context);
      const route = `/${socketId}/${theApp.name}/${e.__name}`;
      console.log(route);
      const func = (req: IncomingMessage) => {
        context.__events[e.__name].next("");
      };
      server.routes.post[route] = func;
    });
    theApp.tasks.forEach(h => {
      h.create(context, session);

      const route = `/${socketId}/${theApp.name}/${h.__name}`;
      const func = (req: IncomingMessage) => {
        const url = parseurl(req) as Url;
        const query = qs.parse(url.query as string);
        const value = query.body;
        context.__events[h._trigger?.__name || ""].next(value);
      };
      server.routes.post[route] = func;

      //TODO - fix race conditions properly
      const withDelay$ = context.__tasks[h.__name].pipe(delay(300));
      withDelay$.subscribe({
        next: v => {
          if (v !== nonce) {
            console.log(`${socketId}/${theApp.name}/${h.__name}`, v);
            context.__state[`task_${h.__name}`].next(v);
            socket.emit(`${theApp.name}/${h.__name}`, v);
          }
        },
        error: e => {
          console.error(e);
        }
      });
    });
    context.__events["initialized"].next("");
  }
  return {
    create,
    __app: theApp,
    __sheet: rxserialize.sheet(theApp)
  };
};


export function trigger(e: Event | Task<any>): TriggerOperator<any>;
export function trigger(e: EventRef | TaskRef<any>): void;
export function trigger(e: Event | Task<any> | EventRef | TaskRef<any>) {
  return isEvent(e) || isTask(e) ? triggerOperator(e) : next(e);
}

const next = (e: EventRef | TaskRef<any>) => {
  e._next();
};

const triggerOperator = (e: Event | Task<any>): RxOperator<null> => {
  const theOperator = async (app: AppContext, session: SessionContext, c: Context): Promise<null> => {
    if (isEvent(e)) {
      (app.__events[e.__name] || session.__events[e.__name]).next("");
    } else {
      (app.__events[e._trigger?.__name || ""] || session.__events[e._trigger?.__name || ""]).next("");
    }
    return Promise.resolve(null);
  };
  theOperator.__name = `Trigger_${e.__name}`;
  theOperator.__type = "Operator";
  theOperator._suboperators = util.emptySubOperators();
  theOperator._subgraph = null as Graph<any, any> | null;
  theOperator._stateInputs = [] as State<unknown>[];
  theOperator._taskInputs = [] as Task<unknown>[];
  return theOperator;
};

export const get = <V>(state: StateRef<V> | TaskRef<V>): V =>
  state._getValue();

const setState = <V>(state: StateRef<V>, value: V): void => {
  state._next(value);
};
const setOperator = <A0>(state: State<A0>, a: RxOperator<A0> | State<A0> | A0): RxOperator<null> => {
  const theOperator = async (app: AppContext, session: SessionContext, c: Context): Promise<null> => {
    let arg: A0;
    if (isState(a)) {
      arg = (app.__state[a.__name] || session.__state[a.__name]).getValue();
    } else if (isOperator(a)) {
      arg = c.data[a.__name];
    } else {
      arg = a;
    }
    (app.__state[state.__name] || session.__state[state.__name]).next(arg);
    return Promise.resolve(null);
  };
  theOperator.__name = `Setter_${state.__name}`;
  theOperator.__type = "Operator";
  theOperator._suboperators = util.emptySubOperators();
  theOperator._subgraph = null as Graph<any, any> | null;
  theOperator._stateInputs = [] as State<unknown>[];
  theOperator._taskInputs = [] as Task<unknown>[];
  return theOperator;
};

export function set<V>(state: StateRef<V>, value: V): void;
export function set<V>(state: State<V>, a: RxOperator<V> | State<V> | V): RxOperator<null>

export function set(): any {
  return isState(arguments[0]) ? setOperator(arguments[0], arguments[1]) : setState(arguments[0], arguments[1]);
}

const diagram = (apps: Record<string, App>, session: Session) => {
  rxserialize.build("App", _.map(apps, a => a.__sheet));
};
export const serve = <T>(apps: Record<string, App>, session: Session, options?: ServerOptions) => {
  const argv = minimist(process.argv.slice(2));
  if (argv.diagram?.toUpperCase() === "TRUE") {
    diagram(apps, session);
    return;
  }
  const defaultOrigin = "http://localhost:3000";
  const defaultPort = 8080;
  const rxBlueprintServer = {
    routes: {post: {}},
    sockets: {},
    sessions: {}
  } as RxBlueprintServer;
  const a = express();
  a.use(cors({origin: options?.cors?.origin || defaultOrigin, methods: ["GET", "POST"]}));
  a.use(bodyParser.json({type: "application/json", strict: false}))
  a.post("/subscribe", (req, res) => {
    const url = parseurl(req) as Url;
    const query = qs.parse(url.query as string);
    const appName = query.app as string;
    const socketId = query.socketId as string;
    apps[appName].create(rxBlueprintServer, socketId);
    res.write("Success");
    res.end();
  });
  a.post("*", (req, res) => {
    console.log("HERE");
    if (req.method === "POST") {
      const url = parseurl(req) as Url;
      const route = rxBlueprintServer.routes.post[url.pathname!];
      if (!route) {
        console.error(`${url.pathname!} was not found`);
        res.statusCode = 404;
        res.end();
      } else {
        route(req);
        res.write("Success")
        res.end();
      }
    }
  });
  const server = http.createServer(a);

  const io = new Server(server, {
    cors: {
      origin: options?.cors?.origin || defaultOrigin,
      methods: ["GET", "POST"]
    }
  });
  io.on('connection', (socket) => {
    rxBlueprintServer.sockets[socket.id] = socket;
    rxBlueprintServer.sessions[socket.id] = createSession(session, socket.id);
    console.log(`a user connected: ${socket.id}`);
  });

  rxserialize.build("App", _.map(apps, a => a.__sheet));

  server.listen(options?.port || defaultPort);
};