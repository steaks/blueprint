import {app, state, event, task} from "blueprint-react";

const HelloWorld = app("helloWorld");
const useMyState = state<string>("helloWorld", "myInput");
const useWordCount = task<number>("helloWorld", "wordCount");
const useCountLetters = event("helloWorld", "countLetters");
const useLetters = task<number>("helloWorld", "letters");

const UI = () => {
  const [myInput, setMyState] = useMyState();
  const [wordCount] = useWordCount();
  const [countLetters] = useCountLetters();
  const [letters] = useLetters();

  return (
    <HelloWorld>
      <div>Hello World!!</div>
      <input defaultValue={myInput} onChange={e => setMyState(e.target.value)}/>
      <button onClick={countLetters}>Count Letters</button>
      <div>Word count: {wordCount}</div>
      <div>Letter count: {letters}</div>
    </HelloWorld>
  );
};

export default UI;