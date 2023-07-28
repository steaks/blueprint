export interface OperatorJSON {
  readonly name: string;
  readonly type: string;
  readonly suboperators: OperatorJSON[];
  readonly subgraph: string | null;
}

export interface TriggerJSON {
  readonly name: string;
}

export interface InputJSON {
  readonly name: string;
}

export interface GraphJSON {
  readonly name: string;
  readonly input: string;
  readonly output: string;
  readonly operators: OperatorJSON[];
  readonly triggers?: TriggerJSON[];
  readonly inputs?: InputJSON[];
}

interface StateJSON {
  readonly name: string;
}

interface EventJSON {
  readonly name: string;
}

export interface SheetJSON {
  readonly name: string,
  readonly graphs: GraphJSON[]
  readonly states: StateJSON[]
  readonly events: EventJSON[]
}

interface SlimSheet {
  readonly name: string
}

export type IndexJSON = {
  readonly name: string;
  readonly sheets: SlimSheet[];
};

