import {app} from "blueprint-react";
import {query} from "blueprint-react";

const HelloWorld = app("helloWorld");
const useWelcomeMessage = query<string>("helloWorld", "welcomeMessage");

const UI = () => {
  const [welcomeMessage] = useWelcomeMessage();
  return (
    <HelloWorld>
      <span>{welcomeMessage}</span>
    </HelloWorld>
  );
};

export default UI;