import {app, create, from, state, task} from "blueprint-server";

const wordCount = (input: string): number =>
  input.split(/\s/).filter(x => x).length;

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