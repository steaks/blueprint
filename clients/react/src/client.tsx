import React, {useState, useEffect, useCallback} from "react";
import {BlueprintConfig, Props, Connection, ConnectionType} from "../types";
import {io} from "socket.io-client";

let connection = null as Connection | null;
let connectionId = null as string | null;
let connectionP = null as null | Promise<null>;

const addListener = <V, >(name: string, onMessage: (data: MessageEvent | V) => void) => {
  console.log(`Add listener ${name}`);
  const c = connection!;
  switch (c.__type) {
    case "ServerSentEvents":
      c.eventSource.addEventListener(name, onMessage);
      break;
    case "WebSocket":
      c.socket.on(name, onMessage);
      break;
  }
};

const removeListener = <V, >(name: string, onMessage: (data: MessageEvent | V) => void) => {
  console.log(`Remove listener ${name}`);
  const c = connection!;
  switch (c.__type) {
    case "ServerSentEvents":
      c.eventSource.removeEventListener(name, onMessage);
      break;
    case "WebSocket":
      c.socket.off(name, onMessage);
      break;
  }
};

const parseMessage = <V, >(e: MessageEvent | V) => {
  switch (connection!.__type) {
    case "ServerSentEvents":
      return JSON.parse((e as MessageEvent).data) as V;
    case "WebSocket":
      return e as V;
  }
};

const fetchConnectionType = async () => {
  const connectionTypeR = await fetch(`${config.uri}/connectionType`, {
    method: "GET",
    headers: {"content-type": "application/json"}
  });
  const json = await connectionTypeR.json();
  return json.connectionType as ConnectionType;
};

const connect = async () => {
  if (connectionP === null) {
    connectionP = new Promise(async (resolve) => {
      const connectionType = await fetchConnectionType();
      switch (connectionType) {
        case "ServerSentEvents":
          connectionId = crypto.randomUUID();
          const eventSource = new EventSource(`${config.uri}/stream?connectionId=${connectionId}`)
          eventSource.addEventListener("open", () => {
            connection = {__type: "ServerSentEvents", eventSource};
            resolve(null);
          });
          break;
        case "WebSocket":
          const socket = io(config.uri.replace("http://", "ws://").replace("https://", "ws://"));
          socket.on("connect", () => {
            connectionId = socket.id!;
            connection = {__type: "WebSocket", socket};
            resolve(null);
          });
          break;
      }
    });
  }
  return await connectionP;
};

const namespace = "/__blueprint__";
const defaultUri = `http://localhost:8080${namespace}`;
export const config = {
  uri: defaultUri
};

export const Blueprint = (p: BlueprintConfig) => {
  const uri = `${p.uri}${namespace}` || defaultUri;
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    config.uri = uri;
    console.debug("Mounting Blueprint");
    connect().then(() => {
      setInitialized(true);
    });
  }, [uri]);

  if (initialized) {
    return <>{p.children}</>
  }
  return <></>;
};

export const state = <V, >(app: string, stateName: string): () => [V | undefined, (v: V) => void] => {
  return () => {
    const [state, setState] = useState<V>();
    const set = useCallback((value: V) => {
      setState(value);
      fetch(`${config.uri}/${connectionId!}/${app}/${stateName}`, {
        method: "POST",
        body: JSON.stringify({id: nextRequestId(app), payload: value}),
        headers: {"content-type": "application/json"}
      });
    }, []);
    const onMessage = useCallback((e: MessageEvent | V) => {
      setState(parseMessage(e));
    }, []);

    useEffect(() => {
      addListener(`${app}/${stateName}`, onMessage);
      return () => {
        removeListener(`${app}/${stateName}`, onMessage);
      }
    }, [onMessage]);
    return [state, set];
  };
};

export const event = (app: string, event: string): () => [() => void] => {
  const trigger = () =>
    fetch(`${config.uri}/${connectionId!}/${app}/${event}`, {
      method: "POST",
      body: JSON.stringify({id: nextRequestId(app), payload: ""}),
      headers: {"content-type": "application/json"}
    });
  return () => [trigger];
};

export const task = <V, >(app: string, task: string): () => [V | undefined, () => void] => {
  return () => {
    const [state, setState] = useState<V>();
    const trigger = useCallback(() => {
      fetch(`${config.uri}/${connectionId!}/${app}/${task}`, {
        method: "POST",
        body: JSON.stringify({id: nextRequestId(app), payload: ""}),
        headers: {"content-type": "application/json"}
      });
    }, []);
    const onMessage = useCallback((e: MessageEvent | V) => {
      const message = parseMessage(e);
      if (message && (message as any).__type === "Error") {
        console.error(message);
      } else {
        console.debug(`${app}/${task}`, message);
        setState(message);
      }
    }, []);
    useEffect(() => {
      addListener(`${app}/${task}`, onMessage)
      return () => {
        removeListener(`${app}/${task}`, onMessage)
      };
    }, [onMessage]);

    return [state, trigger];
  };
};

interface Subscription {
  subscription: Promise<Response>;
  requestId: number;
  count: number;
}

const nextRequestId = (app: string): number => {
  subscriptions[app].requestId = subscriptions[app].requestId + 1;
  return subscriptions[app].requestId;
};

const subscriptions = {} as Record<string, Subscription>;

const subscribe = (name: string) => {
  if (!subscriptions[name]) {
    const p = fetch(`${config.uri}/subscribe?app=${name}&connectionId=${connectionId!}`, {method: "POST"});
    subscriptions[name] = {requestId: 0, subscription: p, count: 1};
  } else {
    subscriptions[name].count = subscriptions[name].count + 1;
  }
  return subscriptions[name];
};

const unsubscribe = (name: string) => {
  subscriptions[name].count = subscriptions[name].count - 1;
  setTimeout(() => {
    if (subscriptions[name].count <= 0) {
      fetch(`${config.uri}/unsubscribe?app=${name}&connectionId=${connectionId!}`, {method: "POST"});
      delete subscriptions[name];
    }
  }, 300);
};

export const app = (name: string) => (props: Props) => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    console.debug(`Subscribing ${name}`);
    subscribe(name).subscription.then(() => setInitialized(true));
    return () => {
      console.debug(`Unsubscribing ${name}`);
      unsubscribe(name);
    };
  }, []);
  if (initialized) {
    return <>{props.children}</>
  }

  return (<></>);
};