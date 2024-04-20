import {app, state, task} from "blueprint-react";
import {useEffect, useState} from "react";

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

      <UI2 />
    </MyApp>
  );
};

const calculateAreaServer = (width: number, height: number): Promise<number> => {
  return Promise.resolve(width * height)
};

const UI2 = () => {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(15);
  const [area, setArea] = useState<number>();

  const calculateArea = async (width: number, height: number) => {
    const response = await calculateAreaServer(width, height);
    setArea(response);
  };

  useEffect(() => {
    console.log("A");
    calculateArea(width, height);
  }, []);

  useEffect(() => {
    console.log("B");
    calculateArea(width, height);
  }, [width, height]);

  return (
    <>
      <input defaultValue={width} onChange={e => setWidth(Number(e.target.value))} />
      <input defaultValue={height} onChange={e => setHeight(Number(e.target.value))} />
      <div>Area of Rectangle: {area}</div>
    </>
  );
};

export default UI;