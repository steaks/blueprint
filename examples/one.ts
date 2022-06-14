import blueprint from "../src/blueprint";

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
    {},
    blueprint.operator.sync(foo),
    blueprint.operator.async(bar)
);

const foobarbaz = blueprint.graph3(
    {},
    blueprint.operator.sync(foo),
    blueprint.operator.async(bar),
    blueprint.operator.async(baz)
);

const mySheet = blueprint.sheet([
    foobar,
    foobarbaz
]);