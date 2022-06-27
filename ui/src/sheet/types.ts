export interface OperatorJSON {
  readonly name: string;
  readonly type: string;
  readonly suboperators: OperatorJSON[];
  readonly subgraph: string | null;
}

export interface GraphJSON {
  readonly name: string;
  readonly operators: OperatorJSON[];
}

export interface SheetJSON {
  readonly name: string,
  readonly graphs: GraphJSON[]
}