import {app, state, hook} from "blueprint-react";

const MyApp = app("myApp");
const useWidth = state<number>("myApp", "width");
const useHeight = state<number>("myApp", "height");
const useArea = hook<number>("myApp", "area")

const UI = () => {
  const [width, setWidth] = useWidth();
  const [height, setHeight] = useHeight();
  const [area] = useArea();


  return (
    <MyApp>
      <input defaultValue={width} onChange={e => setWidth(Number(e.target.value))} />
      <input defaultValue={height} onChange={e => setHeight(Number(e.target.value))} />
      <div>Area of Rectangle: {area}</div>
    </MyApp>
  );
};

export default UI;