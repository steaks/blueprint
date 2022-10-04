import blueprint from "../index";

test("operator-simple", async () => {
  const g = blueprint.graph("test-branch", blueprint.operator.operator(i => `${i}_one`), "a");
  const r = await g("a");
  expect(r).toBe("a_one");
});

test("tap", async () => {
  const g = blueprint.graph("test-branch", blueprint.operator.tap(i => `${i}_one`), "a");
  const r = await g("a");
  expect(r).toBe("a");
});

test("parallel", async () => {
  const g = blueprint.graph(
    "test-branch",
    blueprint.operator.parallel(blueprint.operator.operator(i => `${i}_one`), blueprint.operator.operator(i => `${i}_two`)),
    "two"
  );
  const r = await g("a");
  expect(r).toStrictEqual(["a_one", "a_two"]);
});

test("branch", async () => {
  const g = blueprint.graph("test-branch", blueprint.operator
    .if(i => i === "a", i => `${i}_one`)
    .elseif(i => i === "b", i => `${i}_two`)
    .else(i => `${i}_three`)
    .end("branch"),
    "output"
  );

  const a = await g("a");
  const b = await g("b");
  const c = await g("c");
  expect(a).toBe("a_one");
  expect(b).toBe("b_two");
  expect(c).toBe("c_three");
});
