import blueprint from "blueprint-core";
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

const inputO = blueprint.input<string>();
const fooO = blueprint.operator(foo);
const barO = blueprint.operator(bar, fooO);
const exampleOne = blueprint.graph("example-one", inputO, fooO, barO);


const mySheet = blueprint.serialize.sheet("one", [
  exampleOne
]);

export default mySheet;
