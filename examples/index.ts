import * as fs from "fs";

import {Sheet} from "../src/blueprint";
import one from "./one";

const write = (graph: Sheet, file: string) => {
  const json = JSON.stringify(one, null, 2);
  fs.writeFileSync(`./build/${file}.json`, json)
};

write(one, "one");