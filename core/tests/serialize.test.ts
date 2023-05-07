import blueprint from "../index";

test("simple", async () => {
  const input = blueprint.input<string>()
  const simple = blueprint.operator(i => `${i}_one`, input);
  const g = blueprint.graph("simple", input, simple);
  const sheet = blueprint.serialize.sheet("simple", [g])
  expect(sheet).toStrictEqual({
    "graphs": [
      {
        "input": "input",
        "name": "simple",
        "operators": [
          {
            "name": "input",
            "path": "https://github.com/steaks/blueprint/tree/main/webserver    at Object.<anonymous>.__awaiter (/home/steven/developer/blueprint/core/tests/serialize.test.ts#L4",
            "subgraph": null,
            "suboperators": [],
            "type": "Input"
          },
          {
            "name": "",
            "path": "https://github.com/steaks/blueprint/tree/main/webserver    at Object.<anonymous>.__awaiter (/home/steven/developer/blueprint/core/tests/serialize.test.ts#L4",
            "subgraph": null,
            "suboperators": [],
            "type": "Operator"
          }
        ],
        "output": ""
      }
    ],
    "name": "simple"
  });
});