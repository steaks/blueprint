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

const foo = (p: string) => {
    console.log(p + "FOO");
    return Promise.resolve(p + "FOO");
};

const bar = (p: string) => {
    console.log(p + "BAR");
    return Promise.resolve(p + "BAR");
};

const baz = (p: string) => {
    console.log(p + "BAZ");
    return Promise.resolve(p + "BAZ");
};

const foobar = blueprint.graph2(
    "foobar",
    {},
    blueprint.operator.async(foo),
    blueprint.operator.parallel(blueprint.operator.async(bar), blueprint.operator.async(baz)),
);

const mySheet = blueprint.serialize.sheet("two", [
    foobar
]);

export default mySheet;