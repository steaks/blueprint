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

const foobar = blueprint.graph2(
    "foobar",
    {},
    blueprint.operator.sync(foo),
    blueprint.operator.async(bar)
);

console.log(foobar.name);

const foobarbaz = blueprint.graph3(
    "foobarbaz",
    {},
    blueprint.operator.sync(foo),
    blueprint.operator.async(bar),
    blueprint.operator.async(baz)
);

const doSteven = (name: string) => {
    console.log("DO STEVEN");
    return Promise.resolve("EJACULATION");
};

const doBecky = (name: string) => {
    console.log("DO BECKY");
    return "NO EJACULATION BUT ORGASM";
};

const doBoth = (name: string) => {
    console.log("DO STEVEN AND BECKY");
    return "SNAPS";
};

const mySheet = blueprint.serialize.sheet("MySheet", [
    foobar,
    foobarbaz
]);

export default mySheet;