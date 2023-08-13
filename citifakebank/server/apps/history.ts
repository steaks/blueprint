import rxblueprint from "@blueprint/rx";
const {app, hook, operator} = rxblueprint;

const history = async () =>
  Promise.resolve("The bank was formed in 2023.");

const history$$ = app(() => {
    const history$ = hook(
      operator(history),
    );

    return {
        name: "history",
        state: [],
        events: [],
        hooks: [history$]
    };
});

export default history$$;