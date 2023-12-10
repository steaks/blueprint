import {app, task, from} from "@blueprint/server";

const history = async () =>
  Promise.resolve("The bank was formed in 2023.");

const history$$ = app(() => {
    const history$ = task(
      from(history),
    );

    return {
        name: "history",
        state: [],
        events: [],
        tasks: [history$]
    };
});

export default history$$;