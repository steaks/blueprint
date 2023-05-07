import blueprint from "../index";

const simple = (i: string) => {
  return `${i}_one`
};

test("simple", async () => {
  const input = blueprint.input<string>();
  const simpleO = blueprint.operator(simple, input);
  const g = blueprint.graph("simple", input, simpleO);
  const sheet = blueprint.serialize.sheet("simple", [g])
  expect(sheet).toStrictEqual({
    "graphs": [
      {
        "input": "input",
        "name": "simple",
        "operators": [
          {
            "name": "simple",
            "subgraph": null,
            "suboperators": [],
            "type": "Operator"
          }
        ],
        "output": "simple"
      }
    ],
    "name": "simple"
  });
});