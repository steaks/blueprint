import {app, state, event, task} from "blueprint-react";

const HelloWorld = app("helloWorld");
const useMyState = state<string>("helloWorld", "myState");
const useMyEvent = event("helloWorld", "myEvent");
const useWordCount = task<number>("helloWorld", "wordCount")
const useClickCount = task<number>("helloWorld", "clickCount");

const UI = () => {
  const [myState, setMyState] = useMyState();
  const [triggerMyEvent] = useMyEvent();
  const [wordCount] = useWordCount();
  const [clickCount] = useClickCount();


  return (
    <HelloWorld>
      <div>Hello World!!</div>
      <input defaultValue={myState} onChange={e => setMyState(e.target.value)} />
      <button onClick={triggerMyEvent}>Trigger My Event!</button>
      <div>Word Count: {wordCount}</div>
      <div>Click Count: {clickCount || 0}</div>
    </HelloWorld>
  );
};

export default UI;