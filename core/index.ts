import core, {
  Graph as _Graph,
  AsyncParams as _AsyncParams,
  AsyncOperator as _AsyncOperator,
  Branch as _Branch,
  End as _End,
  BaseContext as _BaseContext,
  With0 as _With0,
  With1 as _With1,
  With2 as _With2,
  With3 as _With3,
  With4 as _With4,
  With5 as _With5
} from "./core";
import serialize, {SheetJSON as _SheetJSON} from "./serialize";

export type BaseContext = _BaseContext;
export type SheetJSON = _SheetJSON;
export type AsyncParams<A, B, C extends BaseContext, D> = _AsyncParams<A, B, C, D>;
export type AsyncOperator<A, B, C extends BaseContext, D> = _AsyncOperator<A, B, C, D>;
export type Branch<A, B, C extends BaseContext, D> = _Branch<A, B, C, D>;
export type End<V> = _End<V>;
export type With0<A> = _With0<A>;
export type With1<A, B = unknown> = _With1<A, B>;
export type With2<A, B = unknown, C = unknown> = _With2<A, B, C>;
export type With3<A, B = unknown, C = unknown, D = unknown> = _With3<A, B, C, D>;
export type With4<A, B = unknown, C = unknown, D = unknown, E = unknown> = _With4<A, B, C, D, E>;
export type With5<A, B = unknown, C = unknown, D = unknown, E = unknown, F = unknown> = _With5<A, B, C, D, E, F>;

export type Graph<A, B> = _Graph<A, B>;

export default {
    ...core,
    serialize,
};
