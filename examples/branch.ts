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

import blueprint from "blueprint-core";

const foo = () => {
  return "FOO";
};

const bar = (foo: string) => {
  return Promise.resolve(foo + "BAR");
};

const baz = (foobar: string) => {
  return Promise.resolve(foobar + "BAZ");
};

const case1 = (a: string) => a;
const case2 = (a: string) => a;
const case3 = (a: string) => a;
const case4 = (a: string) => a;
const case5 = (a: string) => a;

const foobarbaz = () => {
  const input = blueprint.input<string>();
  const branch = blueprint
    .branch("branch", input)
    .case(a => a === "foo", case1)
    .case(a => a === "foo", case2)
    .case(a => a === "foo", case3)
    .case(a => a === "foo", case4)
    .default(case5)

  return blueprint.graph("foobarbaz", input, branch)
};


const mySheet = blueprint.serialize.sheet("branch", [
  foobarbaz()
]);

export default mySheet;
