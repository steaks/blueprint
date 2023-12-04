import {app, event, state, hook, operator} from "blueprint-server";

const wordCount = (words: string): number => {
  const trimmedWords = words.trim();
  return trimmedWords.length === 0 ? 0 : trimmedWords.trim().split(/\s/).length;
};

let _clickCount = 0;
const clickCount = () => {
  _clickCount = _clickCount + 1;
  return _clickCount;
};

export default app(() => {
  const myState$ = state("myState", "Hello State!");
  const myEvent$ = event("myEvent");
  const wordCount$ = hook(
    operator(wordCount, myState$)
  );

  const clickCount$ = hook(
    "clickCount",
    {triggers: [myEvent$]},
    operator(clickCount)
  );

  return {
    name: "helloWorld",
    state: [myState$],
    events: [myEvent$],
    hooks: [wordCount$, clickCount$]
  };
});