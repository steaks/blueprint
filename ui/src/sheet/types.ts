export interface OperatorJSON {
  readonly name: string;
  readonly doc?: string;
  readonly type: string;
  readonly path: string | null;
  readonly suboperators: OperatorJSON[];
  readonly subgraph: string | null;
}

export interface GraphJSON {
  readonly name: string;
  readonly doc?: string;
  readonly operators: OperatorJSON[];
}

export interface SheetJSON {
  readonly name: string,
  readonly doc?: string;
  readonly graphs: GraphJSON[]
}

interface SlimSheet {
  readonly name: string
  readonly doc?: string;
}

export type IndexJSON = {
  readonly name: string;
  readonly sheets: SlimSheet[];
};

