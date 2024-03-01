import {app} from "blueprint-react";

const HelloWorld = app("helloWorld");

const UI = () => {
  return (
    <HelloWorld>
      <span>Hello World!</span>
    </HelloWorld>
  );
};

export default UI;