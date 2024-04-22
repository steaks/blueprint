import React from 'react';
import ReactDOM from 'react-dom/client';
import {Blueprint, app, state, task} from "blueprint-react";

const HelloWorldApp = app("helloWorld");
const useMyInput = state<string>("helloWorld", "myInput");
const useWordCount = task<number>("helloWorld", "wordCount");

const HelloWorld = () => {
  const [myInput, setMyInput] = useMyInput();
  const [wordCount] = useWordCount();

  return (
    <HelloWorldApp>
      <input defaultValue={myInput} onChange={e => setMyInput(e.target.value)}/>
      <div>Word count: {wordCount}</div>
    </HelloWorldApp>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Blueprint>
    <HelloWorld />
  </Blueprint>
);