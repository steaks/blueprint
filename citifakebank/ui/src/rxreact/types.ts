import {ReactNode} from "react";

export interface Props {
  readonly children: ReactNode;
}

export interface BlueprintConfig {
  readonly uri?: string;
  readonly children: ReactNode;
}