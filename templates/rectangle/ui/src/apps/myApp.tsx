import {app, state, task} from "blueprint-react";

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
      <input defaultValue={width} onChange={e => setWidth(Number(e.target.value))} />
      <input defaultValue={height} onChange={e => setHeight(Number(e.target.value))} />
      <div>Area of Rectangle: {area}</div>
    </MyApp>
  );
};

const calculateAreaServer = (width: number, height: number): Promise<number> => {
  return Promise.resolve(width * height)
};

export default UI;