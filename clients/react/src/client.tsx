import React, {useState, useEffect, useCallback} from "react";
import {default as io, Socket} from "socket.io-client";
import {BlueprintConfig, Props} from "../types";

let socket = null as Socket<any, any> | null;
let _socket: Promise<Socket<any, any>> | null = null;

const connect = async () => {
  if (!_socket) {
    _socket = new Promise(resolve => {
      const s = io(
        config.uri.replace("http://", "ws://").replace("https://", "wss://")
      );
      s.on("connect", () => {
        console.debug("Connected");
        console.debug("ID:" + s.id);
        socket = s;
        resolve(s);
      });
    });
  }
  return _socket;
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
    if (!socket) {
      connect().then(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
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
      fetch(`${config.uri}/${socket!.id}/${app}/${stateName}`, {
        method: "POST",
        body: JSON.stringify({id: nextRequestId(app), payload: value}),
        headers: {"content-type": "application/json"}
      });
    }, []);
    const onMessage = useCallback((message: V) => {
      setState(message);
    }, []);

    useEffect(() => {
      console.debug(`Mounting State: ${app} - ${stateName}`);
      socket!.on(`${app}/${stateName}`, onMessage);
      return () => {
        console.debug(`Unmounting State: ${app} - ${stateName}`);
        socket!.off(`${app}/${stateName}`, onMessage);
      }
    }, [onMessage]);
    return [state, set];
  };
};

export const event = (app: string, event: string): () => [() => void] => {
  const trigger = () =>
    fetch(`${config.uri}/${socket!.id}/${app}/${event}`, {
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
      fetch(`${config.uri}/${socket!.id}/${app}/${task}`, {
        method: "POST",
        body: JSON.stringify({id: nextRequestId(app), payload: ""}),
        headers: {"content-type": "application/json"}
      });
    }, []);
    const onMessage = useCallback((message: V) => {
      if (message && (message as any).__type === "Error") {
        console.error(message);
      } else {
        console.debug(`${app}/${task}`, message);
        setState(message);
      }
    }, []);
    useEffect(() => {
      console.debug(`Mounting Task: ${app} - ${task}`);
      socket!.on(`${app}/${task}`, onMessage);
      return () => {
        console.debug(`Unmounting Task: ${app} - ${task}`);
        socket!.off(`${app}/${task}`, onMessage);
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
    const p = fetch(`${config.uri}/subscribe?app=${name}&socketId=${socket!.id}`, {method: "POST"});
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
      fetch(`${config.uri}/unsubscribe?app=${name}&socketId=${socket!.id}`, {method: "POST"});
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