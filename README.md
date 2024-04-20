# Blueprint
*The ergonomic web application framework*

Blueprint is a full-stack web application framework. It combines server and frontend state/events into a single push-based architecture. This approach streamlines state management, synchronizing data, and ui reactivity.

## Simple Example

```
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

const bp = create({myApp});
bp.serve();
```

```
//ui
import React from 'react';
import ReactDOM from 'react-dom/client';
import {app, state, task, Blueprint} from "blueprint-server";

const MyApp = app("myApp");
const useWidth = state<number>("myApp", "width");
const useHeight = state<number>("myApp", "height");
const useArea = task<number>("myApp", "area")

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

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Blueprint>
    <UI />
  </Blueprint>
);
```

**Result:**
<iframe src="https://rectangle-ui-7y67ff2sba-uc.a.run.app/myApp" frameBorder=0 style="background-color:#f8f8f8;border:1px solid #e1e4e5;width:100%;"></iframe>
<br />
**Diagram:**
<iframe src="https://rectangle-ui-7y67ff2sba-uc.a.run.app/__blueprint__?sheet=myApp" frameBorder=0 width="100%" height="300px" style="background-color:#f8f8f8;border:1px solid #e1e4e5;width:100%;"></iframe>
<br />

## Quick Start

The fastest way to get started is to spin up the helloWorld app.

```
wget https://raw.githubusercontent.com/steaks/blueprint-templates/main/createBlueprint.sh
chmod +x createBlueprint.sh
./createBlueprint.sh -t helloWorld MyApp
cd MyApp
make install
make build
make run-server
make run-ui #in separate terminal
```

Visit [http://localhost:3000](http://localhost:3000) to view your app.<br/>
Visit [http://localhost:3000/__blueprint__](http://localhost:3000/__blueprint__) to view the architecture diagram.

## Contributing

Blueprint welcomes all contributors. Contributions can take many forms - bug fixes, enhancements, tests, issues, feedback, etc. Please reach out to Steven at steven.m.wexler@gmail.com.

## Links

- Documentation: https://blueprint-docs.readthedocs.io
