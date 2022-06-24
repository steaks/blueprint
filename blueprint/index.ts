import core from "./src/core";
import serialize, {SheetJSON as _SheetJSON} from "./src/serialize";

export type SheetJSON = _SheetJSON;

export default {
    ...core,
    serialize
};