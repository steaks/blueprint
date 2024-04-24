# Blueprint
*Simple state and data management for web applications*

Blueprint is a full-stack web application framework that simplifies state and data management. Blueprint handles data synchronization, data flow dependencies and race-conditions so devs can focus on business logic. See [why blueprint](https://blueprint-docs.readthedocs.io/en/latest/whyBlueprint/) for a more comprehensive explanation of why Blueprint outperforms traditional web application frameworks.

#### A simple example

The example below creates a web page that calculates the area of a rectangle provided width and height. Blueprint recognizes area should automatically re-calculated when width or height change.

```typescript
//server
import {app, state, task, from} from "blueprint-server";
const area = (width: number, height: number) =>
  width * height;

const myApp = app(() => {
  const width$ = state("width", 10);
  const height$ = state("height", 15);
  const area$ = task(from(area, width$, height$));

  return {
    name: "myApp",
    state: [width$, height$],
    events: [],
    tasks: [area$]
  };
});
```

```typescript
//frontend
import {app, state, task} from "blueprint-react";

const MyApp = app("myApp");
const useWidth = state<number>("myApp", "width");
const useHeight = state<number>("myApp", "height");
const useArea = task<number>("myApp", "area");

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