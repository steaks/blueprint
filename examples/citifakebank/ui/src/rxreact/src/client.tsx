import React, {useState, useEffect, useCallback} from "react";
import io, {Socket} from "socket.io-client";
import {BlueprintConfig, Props} from "../types";

let socket: Socket<any, any> | null = null;
let _socket: Promise<Socket<any, any>> | null = null;

const connect = async () => {
  if (!_socket) {
    _socket = new Promise(resolve => {
      const s = io(config.uri);
      s.on("connect", () => {
        console.log("CONNECTED");
        console.log("ID:" + s.id);
        socket = s;
        resolve(s);
      });
    });
  }
  return _socket;
};

const config = {
  uri: "http://localhost:8080"
};

export const Blueprint = (p: BlueprintConfig) => {
  const defaultUri = "http://localhost:8081";
  const uri = p.uri || defaultUri;
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    config.uri = uri;
    console.log("MOUNTING BLUEPRINT");
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
        body: JSON.stringify(value),
        headers: {"content-type": "application/json"}
      })
    }, []);
    const onMessage = useCallback((message: V) => {
      setState(message);
    }, []);

    useEffect(() => {
      console.log(`MOUNTING STATE: ${app} - ${stateName}`);
      socket!.on(`${app}/${stateName}`, onMessage);
      return () => {
        console.log(`UNMOUNTING STATE: ${app} - ${stateName}`);
        socket!.off(`${app}/${stateName}`, onMessage);
      }
    }, []);
    return [state, set];
  };
};

export const event = (app: string, event: string): () => [() => void] => {
  const trigger = () => fetch(`${config.uri}/${socket!.id}/${app}/${event}`, {method: "POST"});
  return () => [trigger];
};

export const hook = <V, >(app: string, hook: string): () => [V | undefined, () => void] => {
  return () => {
    const [state, setState] = useState<V>();
    const trigger = useCallback(() => {
      fetch(`${config.uri}/${socket!.id}/${app}/${hook}`, {method: "POST"})
    }, []);
    const onMessage = useCallback((message: V) => {
      if (message && (message as any).__type === "Error") {
        console.error(message);
      } else {
        console.log(`${app}/${hook}`, message);
        setState(message);
      }
    }, []);
    useEffect(() => {
      console.log(`MOUNTING HOOK: ${app} - ${hook}`);
      socket!.on(`${app}/${hook}`, onMessage);
      return () => {
        console.log(`UNMOUNTING HOOK: ${app} - ${hook}`);
        socket!.off(`${app}/${hook}`, onMessage);
      };
    }, []);

    return [state, trigger];
  };
};

const subscriptions = {} as Record<string, Promise<Response>>;

const subscribe = (name: string) => {
  if (!subscriptions[name]) {
    const p = fetch(`${config.uri}/subscribe?app=${name}&socketId=${socket!.id}`, {method: "POST"});
    subscriptions[name] = p;
  }
  return subscriptions[name];
};

export const app = (name: string) => (props: Props) => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    console.log(`SUBSCRIBING ${name}`);
    subscribe(name).then(() => setInitialized(true));
  }, []);
  if (initialized) {
    return <>{props.children}</>
  }

  return (<></>);
};