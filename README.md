# Blueprint
*Hooks for the Backend*

Blueprint is a web server designed for quick adoption by React developers. It leverages hooks, reactivity, and is aware of your frontend state. This allows you to build your server the same way you build your frontend. See [why blueprint](./whyBlueprint.md) for a more.

#### A simple example

**Code:**

```
//server
import {app, useState, useQuery} from "blueprint-server";

const area = (width: number, height: number) =>
  width * height;

const myApp = app(() => {
  const width$ = useState("width", 10);
  const height$ = useState("height", 15);
  const area$ = useQuery(area, [width$, height$]);

  return {
    name: "myApp",
    state: [width$, height$],
    queries: [area$]
  };
});

export default myApp;
```

```typescript
//frontend
import {app, state, query} from "blueprint-react";

const MyApp = app("myApp");
const useWidth = state<number>("myApp", "width");
const useHeight = state<number>("myApp", "height");
const useArea = query<number>("myApp", "area");

const UI = () => {
  const [width, setWidth] = useWidth();
  const [height, setHeight] = useHeight();
  const [area] = useArea();


  return (
    <MyApp>
      <input defaultValue={width} onChange={e => setWidth(e.target.value)} />
      <input defaultValue={height} onChange={e => setHeight(e.target.value)} />
      <div>Area of Rectangle: {area}</div>
    </MyApp>
  );
};
```
See the live example at [blueprint-docs.readthedocs.io](https://blueprint-docs.readthedocs.io/en/latest/).

#### How to Get Started?

Get started by following this [tutorial](https://blueprint-docs.readthedocs.io/en/latest/gettingStarted/).

## Contributing

Blueprint welcomes all contributors. Contributions can take many forms - bug fixes, enhancements, tests, issues, feedback, etc. Please reach out to Steven at steven.m.wexler@gmail.com.

## Links

- [Documentation](https://blueprint-docs.readthedocs.io)
- [Getting Started](https://blueprint-docs.readthedocs.io/en/latest/gettingStarted/)
- [Examples](https://blueprint-docs.readthedocs.io/en/latest/examples)