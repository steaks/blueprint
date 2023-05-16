import blueprint from "blueprint-core";

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

const foobar = () => {
    const input = blueprint.input<string>();
    const fooO = blueprint.operator(foo, input);
    const barbazO = blueprint.parallel([bar, baz], fooO)
    return blueprint.graph("foobar", input, fooO, barbazO);
};

const mySheet = blueprint.serialize.sheet("two", [
    foobar()
]);

export default mySheet;
