import {
  BehaviorSubject, catchError,
  combineLatest,
  filter,
  map,
  merge,
  Observable, of,
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
  Graph,
  Operator,
  RxOperator,
  SheetJSON,
  State,
  Event,
  Hook,
  HookOptions, Session, SessionContext, AppContext, AppBlueprint, App, RxBlueprintServer, Cors, ServerOptions
} from "../types";
import {randomUUID} from "crypto";
import http, {IncomingMessage, ServerResponse} from "http";
import * as qs from "qs";
import parseurl from "parseurl";
import {Url} from "url";
import _ from "lodash";
import express from "express";
import cors from "cors";
import {Server, Socket} from "socket.io";
import rxserialize from "./rxserialize";
import util from "./util";

interface RxContext {
  readonly graph: string;
  readonly data: Record<string, any>;
  readonly state: Record<string, BehaviorSubject<any>>;
}

const isEvent = (v: any): v is Event =>
  (v as any).__type === "Event";
export const event = (name: string): Event =>
  ({__type: "Event", __name: name, create: (app: AppContext | SessionContext) => {
      app.__events[name] = new Subject<string>();
    }});

const isState = (v: any): v is State<any> =>
  (v as any).__type === "State";

const nonce = {};
export const state = <V>(name: string, initialValue?: V): State<V> => {
  return {
    __type: "State",
    __name: name,
    create: (app: AppContext | SessionContext) => {
      app.__state[name] = initialValue ? new BehaviorSubject(initialValue) : new BehaviorSubject(nonce as unknown as V);
    }
  };
};


export function hook<A>(o0: RxOperator<A>): Hook<A>;
export function hook<A>(options: HookOptions, o0: RxOperator<A>): Hook<A>;
export function hook<A>(name: string, options: HookOptions, o0: RxOperator<A>): Hook<A>;
export function hook<A, B>(name: string, options: HookOptions, o0: RxOperator<A>, o1: RxOperator<B>): Hook<B>;
export function hook<A, B, C>(name: string, options: HookOptions, o0: RxOperator<A>, o1: RxOperator<B>, o2: RxOperator<C>): Hook<C>;
export function hook<A, B, C, D>(name: string, options: HookOptions, o0: RxOperator<A>, o1: RxOperator<B>, o2: RxOperator<C>, o3: RxOperator<D>): Hook<D>;
export function hook<A, B, C, D, E>(name: string, options: HookOptions, o0: RxOperator<A>, o1: RxOperator<B>, o2: RxOperator<C>, o3: RxOperator<D>, o4: RxOperator<E>): Hook<E>;
export function hook(): Hook<any> {
  let name: string;
  let options: HookOptions;
  let operators: RxOperator<any>[];
  if (arguments.length === 1) {
    options = {} as HookOptions
    operators = util.createArgs(arguments, 0) as RxOperator<any>[];
    name = operators[0].__name;
  } else if (arguments.length === 2) {
    options = arguments[0] as HookOptions
    operators = util.createArgs(arguments, 1) as RxOperator<any>[];
    name = operators[0].__name;
  } else {
    name = arguments[0] as string;
    options = arguments[1] as HookOptions
    operators = util.createArgs(arguments, 2) as RxOperator<any>[];
  }

  const runWhen = options.runWhen || "statechangeandtriggers";
  const optTriggers = options.triggers || [];
  const context = {graph: name, data: {}, state: {}} as RxContext;
  const trigger = options.manualTrigger ? event(`trigger_${name}`) : null;
  const _inputStates = runWhen === "statechangeandtriggers" ? operators.flatMap(o => o._stateInputs) : [];
  const _optionStates = optTriggers.filter(t => !isEvent(t)) as State<any>[];
  const _states = _.chain([..._inputStates, ..._optionStates]).uniqBy(s => s.__name).value();
  const _initialized = runWhen === "statechangeandtriggers" && _states.length === 0 ? [event("initialized")] : [];
  const _allTriggers = [..._inputStates, ...optTriggers, ..._initialized]
  const triggerNames = new Set(_allTriggers.map(t => t.__name));
  const _allInputs = operators.flatMap(o => o._stateInputs).filter(i => !triggerNames.has(i.__name));
  const create = (app: AppContext, session: SessionContext): void => {
    if (!session) {
      console.log("HERE");
    }
    if (trigger) {
      trigger.create(app);
    }
    const operations = operators.map(op => switchMap(async () => {
      const ret = await op(app, session, context);
      context.data[op.__name] = ret;
      return ret;
    }));
    const inputStates = runWhen === "statechangeandtriggers" ? operators.flatMap(o => o._stateInputs) : [];
    const optionStates = optTriggers.filter(t => !isEvent(t)) as State<any>[];
    const states = _
      .chain([...inputStates, ...optionStates])
      .uniqBy(s => s.__name)
      .map(s => app.__state[s.__name] || session.__state[s.__name])
      .value();
    const hookEvent = trigger ? [trigger] : [];
    const optionEvents = optTriggers.filter(isEvent);
    const events = _
      .chain([...optionEvents, ...hookEvent])
      .uniqBy(e => e.__name)
      .map(e => app.__events[e.__name] || session.__events[e.__name])
      .value();
    const initialized = runWhen === "statechangeandtriggers" ? [app.__events["initialized"]] : [];
    const triggers = [...states, ...events, ...initialized];
    if (states.length) {
      const lastestStates$ = combineLatest(states).pipe(filter(v => !_.find(v, vv => vv === nonce)));
      app.__hooks[name] = merge(...triggers).pipe(
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
      app.__hooks[name] = merge(...triggers).pipe(
        operations[0],
        operations[1] ? operations[1] : tap(_.identity),
        operations[2] ? operations[2] : tap(_.identity),
        operations[3] ? operations[3] : tap(_.identity),
        operations[4] ? operations[4] : tap(_.identity),
        operations[5] ? operations[5] : tap(_.identity),
        catchError(e => {
          return of({__type: "Error"});
        }),
      );
    }
  };
  return {
    __name: name,
    __type: "Graph",
    _operators: operators,
    _triggers: _allTriggers,
    _inputs: _allInputs,
    _output: operators[operators.length - 1].__name,
    _trigger: trigger,
    _input: "None",
    create
  };
}

export function operator<R>(func: Func0<R>): RxOperator<R>;
export function operator<A0, R>(func: Func1<A0, R>, arg0: RxOperator<A0> | State<A0>): RxOperator<R>;
export function operator<A0, A1, R>(func: Func2<A0, A1, R>, arg0: RxOperator<A0> | State<A0>, arg1: RxOperator<A1> | State<A1>): RxOperator<R>;
export function operator<A0, A1, A2, R>(func: Func3<A0, A1, A2, R>, arg0: RxOperator<A0> | State<A0>, arg1: RxOperator<A1> | State<A1>, arg2: RxOperator<A2> | State<A2>): RxOperator<R>;
export function operator(): RxOperator<unknown> {
  const func = arguments[0];
  const args = util.createArgs(arguments, 1);
  const stateInputs = args.filter(isState)
  // const theOperator = createOperator(func, args);
  const theOperator = async (app: AppContext, session: SessionContext, c: Context): Promise<unknown> => {
    const a = args.map(a => {
      if (isState(a)) {
        return (app.__state[a.__name] || session.__state[a.__name]).getValue();
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
  return theOperator;
}

const createSession = (session: Session, socketId: string): SessionContext => {
  const context = {__id: randomUUID(), __socketId: socketId, __name: "session", __state: {}, __events: {}, __hooks: {}} as SessionContext;
  _.forEach(session.state, s => {
    s.create(context);
  });
  _.forEach(session.events, e => {
    e.create(context);
  });
  _.forEach(session.hooks, h => {
    h.create({} as AppContext, context);
  });
  return context;
};

export const app = (func: () => AppBlueprint): App => {
  const theApp = func();
  theApp.events.push(event("initialized"));
  const create = (server: RxBlueprintServer, socketId: string) => {
    const context = {__id: randomUUID(), __socketId: socketId, __name: theApp.name, __state: {}, __events: {}, __hooks: {}} as AppContext;
    const socket = server.sockets[socketId];
    const session = server.sessions[socketId];
    theApp.state.forEach(s => {
      s.create(context);
      const route = `/${socketId}/${theApp.name}/${s.__name}`;
      const func = (req: IncomingMessage) => {
        const url = parseurl(req) as Url;
        const query = qs.parse(url.query as string);
        const value = query.body;
        context.__state[s.__name].next(value);
      };
      server.routes.post[route] = func;
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
    theApp.hooks.forEach(h => {
      h.create(context, session);

      const route = `/${socketId}/${theApp.name}/${h.__name}`;
      const func = (req: IncomingMessage) => {
        const url = parseurl(req) as Url;
        const query = qs.parse(url.query as string);
        const value = query.body;
        context.__events[h._trigger?.__name || ""].next(value);
      };
      server.routes.post[route] = func;

      context.__hooks[h.__name].subscribe({
        next: v => {
          console.log(`${socketId}/${theApp.name}/${h.__name}`, v);
          socket.emit(`${theApp.name}/${h.__name}`, v);
        },
        error: e => {
          console.log("ERROR");
          console.error(e);
          console.log("OMFG");
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

export const trigger = (e: Event | Hook<any>): RxOperator<null> => {
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
  return theOperator;
};

export const serve = <T>(apps: Record<string, App>, session: Session, options?: ServerOptions) => {
  const defaultOrigin = "http://localhost:3000";
  const defaultPort = 8080;
  const rxBlueprintServer = {
    routes: {post: {}},
    sockets: {},
    sessions: {}
  } as RxBlueprintServer;
  const a = express();
  a.use(cors({origin: options?.cors?.origin || defaultOrigin, methods: ["GET", "POST"]}));
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

export default {
  serve
};