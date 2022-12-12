import React from "react";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import Loader from "../components/Loader";

import ThreeComponent from "./ThreeComponent";
import BridgeToEffect from "./BridgeToEffect";

const CanvasComponent = ({ offset, isLoaded, setLoaded }) => {
  return (
    <>
      <Leva collapsed />
      <Canvas>
        <color attach={"background"} args={["#252525"]} />
        <BridgeToEffect />
        <ThreeComponent offset={offset} />
        <Loader isLoaded={isLoaded} setLoaded={setLoaded} />
      </Canvas>
    </>
  );
};

export default CanvasComponent;
