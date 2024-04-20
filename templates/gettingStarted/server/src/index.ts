import {app, create, from, state, task} from "blueprint-server";
import {identity} from "lodash";

const wordCount = (input: string): number =>
  input.split(/\s/).filter(identity).length;

const helloWorld = app(() => {
  const myInput$ = state("myInput", "Hello World!");
  const wordCount$ = task(from(wordCount, myInput$));

  return {
    name: "helloWorld",
    state: [myInput$],
    events: [],
    tasks: [wordCount$]
  };
});

const bp = create({helloWorld});
bp.serve();