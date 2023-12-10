import {app, state, task, operator} from "blueprint-server";
const area = (width: number, height: number) =>
  width * height;

const myApp = app(() => {
  const width$ = state("width", 10);
  const height$ = state("height", 15);
  const area$ = task(fromarea, width$, height$));

  return {
    name: "myApp",
    state: [width$, height$],
    events: [],
    tasks: [area$]
  };
});

export default myApp;