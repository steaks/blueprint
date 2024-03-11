import {app, state, task, event, from} from "blueprint-server";

const wordCount = (input: string): number => {
  const trimmedInput = input.trim();
  return trimmedInput.length === 0 ? 0 : trimmedInput.trim().split(/\s/).length;
};

const letters = (input: string): number =>
  input.trim().length;

const helloWorld = app(() => {
  const myInput$ = state("myInput", "Hello Input!");
  const countLetters$ = event("countLetters");
  const wordCount$ = task(
    from(wordCount, myInput$)
  );
  const letters$ = task(
    {name: "letters", triggers: [countLetters$]},
    from(letters, myInput$)
  );

  return {
    name: "helloWorld",
    state: [myInput$],
    events: [countLetters$],
    tasks: [wordCount$, letters$]
  };
});

export default helloWorld;