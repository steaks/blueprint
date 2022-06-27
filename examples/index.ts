import * as fs from "fs";

import {SheetJSON} from "../blueprint";
import one from "./one";
import two from "./two";
import branch from "./branch";
import eslint from "./eslint";

const write = (graph: SheetJSON, file: string) => {
  const json = JSON.stringify(graph, null, 2);
  fs.writeFileSync(`../ui/public/build/${file}.json`, json)
};

write(one, "one");
write(two, "two");
write(branch, "branch");
write(eslint, "eslint");
