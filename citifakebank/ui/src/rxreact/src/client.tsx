import React, {useState, useEffect, useCallback} from "react";
import io, {Socket} from "socket.io-client";
import {BlueprintConfig, Props} from "../types";

let socket: Socket<any, any> | null = null;

const config = {
  uri: "http://localhost:8080"
};

export const Blueprint = (p: BlueprintConfig) => {
  const defaultUri = "http://localhost:8080";
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!socket) {
      console.log("INITIALIZING");
      config.uri = p.uri || defaultUri;
      socket = io(config.uri);
      socket.on("connect", () => {
        setInitialized(true);
        console.log("ID:" + socket!.id);
      });
    } else {
      setInitialized(true);
    }
  }, []);

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
      fetch(`${config.uri}/${socket!.id}/${app}/${stateName}?body=${value}`, {method: "POST"});
    }, []);
    const onMessage = useCallback((message: V) => {
      setState(message);
    }, []);

    useEffect(() => {
      socket!.on(`${app}/${stateName}`, onMessage);
      return () => {
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

const subscriptions = new Set();
export const app = (name: string) => (props: Props) => {
  const [, setInitialized] = useState(false);
  useEffect(() => {
    if (!subscriptions.has(name)) {
      console.log(`SUBSCRIBING ${name}`);
      subscriptions.add(name);
      if (!socket!.id) {
        setTimeout(async () => {
          await fetch(`${config.uri}/subscribe?app=${name}&socketId=${socket!.id}`, {method: "POST"});
          subscriptions.add(name);
          setInitialized(true);
        }, 100);
      }
    }
  }, []);
  if (subscriptions.has(name)) {
    return <>{props.children}</>
  }

  return (<></>);
};