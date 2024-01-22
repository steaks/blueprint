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
  RefParam,
  StateRef,
  TaskRef,
  EventRef,
  TriggerOperator,
  BlueprintRequest,
  BlueprintIO,
  BlueprintExpress, Blueprint, Servers, Serialized
} from "../types";
import minimist from "minimist";
import {randomUUID} from "crypto";
import http from "http";
import * as qs from "qs";
import parseurl from "parseurl";
import {Url} from "url";
import _ from "lodash";
import express, {NextFunction, Request} from "express";
import cors from "cors";
import {Server, Socket} from "socket.io";
import rxserialize from "./rxserialize";
import util from "./util";
import bodyParser from "body-parser";
import {RequestHandler} from "express-serve-static-core";

interface RxContext {
  readonly graph: string;
  readonly data: Record<string, any>;
  readonly state: Record<string, BehaviorSubject<any>>;
}

const rxBlueprintServer = {
  routes: {post: {}},
  sockets: {},
  sessions: {},
  apps: {}
} as RxBlueprintServer;

const isEvent = (v: any): v is Event =>
  (v as any).__type === "Event";
export const event = (name: string): Event =>
  ({
    __type: "Event", __name: name,
    create: (app: AppContext | SessionContext) => {
      app.__events[name] = new Subject<string>();
    },
    destroy: (app: AppContext | SessionContext) => {
      app.__events[name].complete();
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
      if (initialValue !== undefined) {
        app.__state[name] = new BehaviorSubject<any>(initialValue);
      } else {
        app.__state[name] = new BehaviorSubject(nonce as unknown as V);
      }
    },
    destroy: (app: AppContext | SessionContext) => {
      app.__state[name].complete();
    }
  };
};


export function task<A>(o0: RxOperator<A>): Task<A>;
export function task<A>(options: TaskOptions, o0: RxOperator<A>): Task<A>;
export function task<A>(options: TaskOptions, o0: RxOperator<A>, o1: TriggerOperator<any>): Task<A>;
export function task<A>(options: TaskOptions, o0: RxOperator<A>, o1: TriggerOperator<any>, o2: TriggerOperator<any>): Task<A>;
export function task<A>(options: TaskOptions, o0: RxOperator<A>, o1: TriggerOperator<any>): Task<A>;
export function task<A>(options: TaskOptions, o0: RxOperator<A>, o1: TriggerOperator<any>, o2: TriggerOperator<any>, o3: TriggerOperator<any>, o4: TriggerOperator<any>): Task<A>;
export function task(): Task<any> {
  let name: string;
  let options: TaskOptions;
  let operators: RxOperator<any>[];
  if (arguments.length === 1) {
    options = {} as TaskOptions
    operators = util.createArgs(arguments, 0) as RxOperator<any>[];
    name = operators[0].__name;
  } else {
    options = arguments[0] as TaskOptions
    name = options.name;
    operators = util.createArgs(arguments, 1) as RxOperator<any>[];
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
        map(() => ""),
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
        map(()=> ""),
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
  const destroy = (app: AppContext, session: SessionContext) => {
    taskState.destroy(app);
    if (taskEvent) {
      taskEvent!.destroy(app);
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
    create,
    destroy
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
    __tasks: {},
    __requests$: new Subject<BlueprintRequest>()
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

const route = (socketId: string, app: AppBlueprint, v: State<any> | Event | Task<any>): string =>
  `/${socketId}/${app.name}/${v.__name}`;

export const app = (func: () => AppBlueprint): App => {
  const theApp = func();
  theApp.events.push(event("initialized"));
  const create = (socketId: string) => {
    const key = `${theApp.name}_${socketId}`;
    const context = {
      __id: randomUUID(),
      __socketId: socketId,
      __name: theApp.name,
      __state: {},
      __events: {},
      __tasks: {},
      __requests$: new Subject<BlueprintRequest>(),
      __lastRequestId: 0,
    } as AppContext;
    rxBlueprintServer.apps[key] = context;
    context.__requestSubscription = context.__requests$.subscribe(r => {
      const onDeck = context.__lastRequestId + 1;
      if (r.id < onDeck) {
        return;
      } else if (r.id > onDeck) {
        setTimeout(() => context.__requests$.next({...r, count: r.count + 1}), 300);
      } else if (r.id === onDeck) {
        switch (r.__type) {
          case "state":
            context.__lastRequestId = r.id;
            context.__state[r.name].next(r.payload);
            break;
          case "event":
            context.__lastRequestId = r.id;
            context.__events[r.name].next(r.payload);
            break;
          case "task":
            context.__lastRequestId = r.id;
            context.__events[r.name].next(r.payload);
            break;
        }
      }
    });
    const socket = rxBlueprintServer.sockets[socketId];
    const session = rxBlueprintServer.sessions[socketId];
    theApp.state.forEach(s => {
      s.create(context);
      rxBlueprintServer.routes.post[route(socketId, theApp, s)] = (req: Request) => {
        const id = req.body.id as number;
        const name = s.__name;
        const payload = req.body.payload;
        const request = {__type: "state", id, name, count: 0, payload} as BlueprintRequest;
        context.__requests$.next(request);
      };
      //TODO - fix race conditions properly
      const withDelay$ = context.__state[s.__name].pipe(delay(300));
      withDelay$.subscribe({
        next: v => {
          if (v !== nonce) {
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
      rxBlueprintServer.routes.post[route(socketId, theApp, e)] = (req: Request) => {
        const id = req.body.id as number;
        const name = e.__name;
        const payload = req.body.payload;
        const request = {__type: "event", id, name, count: 0, payload} as BlueprintRequest;
        context.__requests$.next(request);
      };
    });
    theApp.tasks.forEach(h => {
      h.create(context, session);
      rxBlueprintServer.routes.post[route(socketId, theApp, h)] = (req: Request) => {
        const id = req.body.id as number;
        const name = h._trigger?.__name || "";
        const payload = req.body.payload;
        const request = {__type: "task", id, name, count: 0, payload} as BlueprintRequest;
        context.__requests$.next(request);
      };

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
  };

  const destroy = (socketId: string) => {
    const key = `${theApp.name}_${socketId}`;
    const app = rxBlueprintServer.apps[key];
    theApp.state.forEach(s => {
      s.destroy(app)
      delete rxBlueprintServer.routes.post[route(socketId, theApp, s)];
    });
    theApp.events.forEach(e => {
      e.destroy(app)
      delete rxBlueprintServer.routes.post[route(socketId, theApp, e)];
    });
    theApp.state.forEach(t => {
      t.destroy(app)
      delete rxBlueprintServer.routes.post[route(socketId, theApp, t)];
    });
    app.__requests$.complete();
    app.__requestSubscription?.unsubscribe();
  };

  return {
    create,
    destroy,
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

const onConnection = (apps: Record<string, App>, session: Session) => (socket: Socket) => {
  rxBlueprintServer.sockets[socket.id] = socket;
  rxBlueprintServer.sessions[socket.id] = createSession(session, socket.id);
  console.log(`a user connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`a user disconnected: ${socket.id}`);
    _
      .chain(rxBlueprintServer.apps)
      .filter(a => a.__socketId === socket.id)
      .forEach(a => {
        const key = `${a.__name}_${socket.id}`
        apps[a.__name].destroy(socket.id);
        delete rxBlueprintServer.apps[key];
      });
    delete rxBlueprintServer.sockets[socket.id];
    delete rxBlueprintServer.sessions[socket.id];
  });
};

const onSubscribe = (apps: Record<string, App>, req: express.Request, res: express.Response) => {
  const url = parseurl(req) as Url;
  const query = qs.parse(url.query as string);
  const appName = query.app as string;
  const socketId = query.socketId as string;
  apps[appName].create(socketId);
  res.write("Success");
  res.end();
};

const onUnsubscribe = (apps: Record<string, App>, req: express.Request, res: express.Response) => {
  const url = parseurl(req) as Url;
  const query = qs.parse(url.query as string);
  const appName = query.app as string;
  const socketId = query.socketId as string;
  apps[appName].destroy(socketId);
  res.write("Success");
  res.end();
};

const onSheets = (res: express.Response) => {
  res.json({name: serialized.name, sheets: serialized.slimSheets})
  res.end();
};

const onSheet = (req: express.Request, res: express.Response) => {
  const url = parseurl(req) as Url;
  const query = qs.parse(url.query as string);
  const sheetName = query.sheet;
  const sheet = serialized.sheets.find(s => s.name === sheetName);
  res.json(sheet)
  res.end();
};

const router = (apps: Record<string, App>, namespace: string) => (req: express.Request, res: express.Response) => {
  const url = parseurl(req) as Url;
  if (url.pathname === "/__sheets__") {
    onSheets(res);
  } else if (url.pathname === "/__sheet__") {
    onSheet(req, res);
  } else if (url.pathname === "/subscribe") {
    onSubscribe(apps, req, res);
  } else if (url.pathname === "/unsubscribe") {
    onUnsubscribe(apps, req, res);
  } else if (req.method === "POST") {
    const url = parseurl(req) as Url;
    const route = rxBlueprintServer.routes.post[url.pathname!];
    if (route) {
      route(req);
      res.write("Success")
      res.end();
    } else {
      console.error(`${url.pathname!} was not found`);
      res.statusCode = 404;
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
};

const namespace = "/__blueprint__";

const blueprintExpress = (apps: Record<string, App>, session: Session): BlueprintExpress => {
  const app = router(apps, namespace) as unknown as express.Application;
  const serve = (options?: ServerOptions) => {
    const e = express();
    e.use(cors({origin: options?.cors?.origin || defaultOrigin, methods: ["GET", "POST"]}));
    e.use(namespace, bodyParser.json());
    e.use(namespace, app);
    const server = http.createServer(e);
    server.listen(options?.port || defaultPort);
    return server;
  };
  return {
    path: namespace,
    app,
    serve
  }
};

const blueprintIO = (apps: Record<string, App>, session: Session): BlueprintIO => {
  const _onConnection = onConnection(apps, session);
  const serve = (server: http.Server, options?: ServerOptions): Server => {
    const io = new Server(server, {
      cors: {
        origin: options?.cors?.origin || defaultOrigin,
        methods: ["GET", "POST"]
      }
    });
    io.of(namespace).on('connection', _onConnection);
    return io;
  };

  return {
    namespace: namespace,
    onConnection: onConnection(apps, session),
    serve
  };
};

export const create = (apps: Record<string, App>, session: Session): Blueprint => {
  serialized = rxserialize.build("App", _.map(apps, a => a.__sheet));
  const _express = blueprintExpress(apps, session);
  const _io = blueprintIO(apps, session);
  const serve = (options?: ServerOptions): Servers => {
    const expressServer = _express.serve(options);
    const ioServer = _io.serve(expressServer, options);
    return {
      expressServer: expressServer,
      ioServer
    };
  };
  return {
    express: blueprintExpress(apps, session),
    io: blueprintIO(apps, session),
    serve
  }
};

const defaultOrigin = "http://localhost:3000";
const defaultPort = 8080;
let serialized: Serialized;