import {app} from "blueprint-server";

const helloWorld = app(() => {
  return {
    name: "helloWorld",
    state: [],
    events: [],
    tasks: []
  };
});

export default helloWorld;