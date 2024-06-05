import {app} from "blueprint-server";
import {useQuery} from "blueprint-server";

const welcomeMessage = () => {
  Promise.resolve("Hello World!");
}

const helloWorld = app(() => {
  const welcomeMessage$ = useQuery(welcomeMessage, []);

  return {
    name: "helloWorld",
    state: [],
    events: [],
    queries: [welcomeMessage$],
    effects: []
  };
});

export default helloWorld;