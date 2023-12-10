import {app, event, state, task, from} from "blueprint-server";

const wordCount = (words: string): number => {
  const trimmedWords = words.trim();
  return trimmedWords.length === 0 ? 0 : trimmedWords.trim().split(/\s/).length;
};

let _clickCount = 0;
const clickCount = () => {
  _clickCount = _clickCount + 1;
  return _clickCount;
};

const helloWorld = app(() => {
  const myState$ = state("myState", "Hello State!");
  const myEvent$ = event("myEvent");
  const wordCount$ = task(
    from(wordCount, myState$)
  );

  const clickCount$ = task(
    "clickCount",
    {triggers: [myEvent$]},
    from(clickCount)
  );

  return {
    name: "helloWorld",
    state: [myState$],
    events: [myEvent$],
    tasks: [wordCount$, clickCount$]
  };
});

export default helloWorld;