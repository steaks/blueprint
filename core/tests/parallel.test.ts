import blueprint from "../index";

test("simple-parallel", async () => {
  const input = blueprint.input<string>()
  const parallel = blueprint.parallel([i => `${i}_one`, i => `${i}_two`], input);
  const g = blueprint.graph("simple-parallel", input, parallel);
  const r = await g("a");
  expect(r).toStrictEqual(["a_one", "a_two"]);
});

test("async-parallel", async () => {
  const input = blueprint.input<string>()
  const parallel = blueprint.parallel([async i => Promise.resolve(`${i}_one`), i => `${i}_two`], input);
  const g = blueprint.graph("simple-parallel", input, parallel);
  const r = await g("a");
  expect(r).toStrictEqual(["a_one", "a_two"]);
});