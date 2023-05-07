import blueprint from "../index";

test("simple-branch", async () => {
  const input = blueprint.input<string>()
  const branch = blueprint
    .branch("mybranch")
    .case(() => false, () => "one")
    .case(() => true, () => "two")
    .default(() => "three")
  const g = blueprint.graph("simple-branch", input, branch);
  const r = await g("");
  expect(r).toBe("two");
});

test("async-branch", async () => {
  const input = blueprint.input<string>()
  const branch = blueprint
    .branch("mybranch")
    .case(() => false, () => Promise.resolve("one"))
    .case(() => false, () => "two")
    .default(() => Promise.resolve("three"))
  const g = blueprint.graph("simple-branch", input, branch);
  const r = await g("");
  expect(r).toBe("three");
});

test("parameters-branch", async () => {
  const input = blueprint.input<string>()
  const branch = blueprint
    .branch("mybranch", input)
    .case(i => i === "one", () => "one")
    .case(i => i === "two", () => "two")
    .default(() => Promise.resolve("three"))
  const g = blueprint.graph("simple-branch", input, branch);
  const r = await g("two");
  expect(r).toBe("two");
});