/*
Vision:
- System that creates a visual representation of the architecture
- As a user:
    - Looking at the visualization, I can see:
        - Pieces of work
        - Dependencies between those pieces
        - Inputs and outputs
    - I can define the pieces of work at whatever granularity I wish
    - I can drill down into a piece of work and see the pieces that comprise it (i.e. zoom in, zoom out to change level of detail)
- As a user, I cannot:
    - Use the system to schedule work
    - Enact any code changes via the UI

Farther future, out of scope:
- UI-first development
*/

import blueprint from "blueprint";

const foo = () => {
  console.log("FOO");
  return "FOO";
};

const bar = (foo: string) => {
  console.log(foo + "BAR");
  return Promise.resolve(foo + "BAR");
};

const baz = (foobar: string) => {
  console.log(foobar + "BAZ");
  return Promise.resolve(foobar + "BAZ");
};

const Test = {
  foo
};

const foobar = blueprint.graph(
  "foobar",
  blueprint.operator.operator(Test.foo),
  blueprint.operator.operator(bar),
  blueprint.operator.parallel(foo, bar),
  "foobar"
);

console.log(foobar.name);

const foobarbaz = blueprint.graph(
  "foobarbaz",
  blueprint.operator.operator(foo),
  blueprint.operator.operator(bar),
  blueprint.operator.parallel(foobar, foobar),
  "foobar"
);

const hmm = blueprint.graph(
  "hmm",
  blueprint.operator.operator(foo),
  blueprint.operator.operator(bar),
  blueprint.operator
    .if(a => true, foobar)
    .else(foobar)
    .end("ifA"),
    "foobar"
);

const hmm2 = blueprint.graph(
  "hmm2",
  blueprint.operator.operator(foo),
  blueprint.operator.operator(bar),
  blueprint.operator.parallel(foobar, foobar),
  "foobar"
);



const mySheet = blueprint.serialize.sheet("one", [
  foobar,
  foobarbaz,
  hmm,
  hmm2
]);

export default mySheet;
