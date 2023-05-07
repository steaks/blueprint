import blueprint from "../index";

test("one-operator", async () => {
  const input = blueprint.input<string>()
  const simple = blueprint.operator(i => `${i}_one`, input);
  const g = blueprint.graph("one-operator", input, simple);
  const r = await g("a");
  expect(r).toBe("a_one");
});

test("two-operators", async () => {
  const input = blueprint.input<string>()
  const one = blueprint.operator(i => `${i}_one`, input);
  const two = blueprint.operator((i, o) => `input: ${i}, one: ${o}, two: ${i}_two`, input, one);
  const g = blueprint.graph("two-operators", input, one, two);
  const r = await g("a");
  expect(r).toBe("input: a, one: a_one, two: a_two");
});

test("async-operator", async () => {
  const input = blueprint.input<string>()
  const asyncOperator = blueprint.operator(async i => Promise.resolve(`${i}_one`), input);
  const g = blueprint.graph("two-operators", input, asyncOperator);
  const r = await g("a");
  expect(r).toBe("a_one");
});