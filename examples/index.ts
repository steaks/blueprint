import * as fs from "fs";

import one from "./one";
import {SheetJSON} from "../blueprint";

const write = (graph: SheetJSON, file: string) => {
  const json = JSON.stringify(one, null, 2);
  fs.writeFileSync(`../ui/public/${file}.json`, json)
};

write(one, "one");