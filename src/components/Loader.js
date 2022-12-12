import React from "react";
import { useProgress } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Loader = ({ isLoaded, setLoaded }) => {
  const { loaded, total } = useProgress();

  useFrame(() => {
    const loadedPercentage = Math.floor((loaded / total) * 100);
    if (!isLoaded && loadedPercentage === 100) {
      window.setTimeout(() => {
        setLoaded(true);
      }, 200);
    }
  });

  return <></>;
};

export default Loader;
