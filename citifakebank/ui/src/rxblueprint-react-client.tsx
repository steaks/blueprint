import io from "socket.io-client";
import React, {ReactNode, useEffect, useState} from "react";
const socket = io("http://localhost:8080");
socket.on("connect", () => {
  console.log("ID:" + socket.id);
});
export const state = <V, >(app: string, stateName: string): () => [V | undefined, (v: V) => void] => {
  let _setState = undefined as undefined | Function;
  socket.on(`${app}/${stateName}`, (message: V) => {
    if (_setState) {
      _setState(message);
    }
  });
  return () => {
    const [state, setState] = useState<V>();
    _setState = setState;
    const set = (value: V) => {
      setState(value);
      fetch(`http://localhost:8080/${socket.id}/${app}/${stateName}?body=${value}`, {method: "POST"});
    };
    return [state, set];
  };
};

export const event = (app: string, event: string): () => [() => void] => {
  const trigger = () => fetch(`http://localhost:8080/${socket.id}/${app}/${event}`, {method: "POST"});
  return () => [trigger];
};

export const hook = <V, >(app: string, hook: string): () => [V | undefined, () => void] => {
  let _setState = undefined as undefined | Function;
  socket.on(`${app}/${hook}`, (message: V) => {
    console.log(`${app}/${hook}`, message);
    if (_setState) {
      _setState(message);
    }
  });
  const trigger = () => fetch(`http://localhost:8080/${socket.id}/${app}/${hook}`, {method: "POST"});

  return () => {
    const [state, setState] = useState<V>();
    _setState = setState;
    return [state, trigger];
  };
};

interface Props {
  readonly children: ReactNode;
}

const subscriptions = new Set();
export const app = (name: string) => (props: Props) => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!subscriptions.has(name)) {
      subscriptions.add(name);
      if (!socket.id) {
        setTimeout(async () => {
          await fetch(`http://localhost:8080/subscribe?app=${name}&socketId=${socket.id}`, {method: "POST"});
          subscriptions.add(name);
          setInitialized(true);
        }, 300);
      }
    }
  }, []);
  if (subscriptions.has(name)) {
    return <>{props.children}</>
  }

  return (<></>);
};