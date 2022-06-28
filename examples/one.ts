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

import blueprint from "../blueprint";

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

const foobar = blueprint.graph3(
  "foobar",
  {},
  blueprint.operator.async(foo),
  blueprint.operator.async(bar),
  blueprint.operator.parallel(foo, bar)
);

console.log(foobar.name);

const foobarbaz = blueprint.graph3(
  "foobarbaz",
  {},
  blueprint.operator.async(foo),
  blueprint.operator.async(bar),
  blueprint.operator.parallel(foobar, foobar)
);

const hmm = blueprint.graph3(
  "hmm",
  {},
  blueprint.operator.async(foo),
  blueprint.operator.async(bar),
  blueprint.operator
    .if(a => true, foobar)
    .else(foobar)
    .end("ifA")
);

const hmm2 = blueprint.graph3(
  "hmm2",
  {},
  blueprint.operator.async(foo),
  blueprint.operator.async(bar),
  blueprint.operator.parallel(foobar, foobar)
);


const mySheet = blueprint.serialize.sheet("one", [
  foobar,
  foobarbaz,
  hmm,
  hmm2
]);

export default mySheet;