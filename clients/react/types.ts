import {ReactNode} from "react";
import {Socket} from "socket.io-client";

export interface Props {
  readonly children: ReactNode;
}

export interface BlueprintConfig {
  readonly uri?: string;
  readonly children: ReactNode;
}


export type ConnectionType = "ServerSentEvents" | "WebSocket";

interface ServerSentEventsConnection {
  readonly __type: "ServerSentEvents";
  readonly eventSource: EventSource;
}
interface WebSocketConnection {
  readonly __type: "WebSocket",
  readonly socket: Socket;
}

export type Connection = ServerSentEventsConnection | WebSocketConnection;