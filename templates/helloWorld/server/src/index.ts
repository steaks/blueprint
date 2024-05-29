import {app, create, useState, useQuery} from "blueprint-server";

const wordCount = (input: string): number =>
  input.split(/\s/).filter(x => x).length;

const helloWorld = app(() => {
  const myInput$ = useState("myInput", "Hello World!");
  const wordCount$ = useQuery(wordCount, [myInput$]);

  return {
    name: "helloWorld",
    state: [myInput$],
    events: [],
    queries: [wordCount$]
  };
});

const bp = create({helloWorld});
bp.serve();