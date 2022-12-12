import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { useControls } from "leva";
import { shaderMaterial } from "@react-three/drei";
import MainVertexShader from "../shaders/main/VertexShader";
import MainFragmentShader from "../shaders/main/FragmentShader";
import SecondaryVertexShader from "../shaders/secondary/VertexShader";
import SecondaryFragmentShader from "../shaders/secondary/FragmentShader";
import * as THREE from "three";

import MainTexture from "../assets/textures/textureSliderCompressed.png";

const textureLoader = new THREE.TextureLoader();
const textureMain = textureLoader.load(MainTexture);
textureMain.wrapS = THREE.RepeatWrapping;
textureMain.wrapT = THREE.RepeatWrapping;
textureMain.encoding = THREE.sRGBEncoding;

const MainPlaneMaterial = shaderMaterial(
  {
    uValue: 1,
    uTextureMain: textureMain,
    uQuadSize: new THREE.Vector2(0, 0),
    uTextureSize: new THREE.Vector2(1, 1),
    uMouseX: 0,
    uOffsetX: 0,
    uNoiseX: 0,
  },
  MainVertexShader,
  MainFragmentShader
);

const SecondaryPlaneMaterial = shaderMaterial(
  {
    uValue: 1,
    uTextureMain: textureMain,
    uQuadSize: new THREE.Vector2(0, 0),
    uTextureSize: new THREE.Vector2(1, 1),
    uMouseX: 0,
    uTime: 0.5,
    uActiveLayers: 1,
    uPatron: 1,
    uOffsetX: 0,
    uNoiseX: 0,
  },
  SecondaryVertexShader,
  SecondaryFragmentShader
);

extend({ MainPlaneMaterial });
extend({ SecondaryPlaneMaterial });

const ThreeComponent = ({ offset }) => {
  const { camera, viewport } = useThree();
  const mainPlaneReference = useRef(null);
  const mainPlaneMaterialReference = useRef(null);
  const secondaryMaterialReference = useRef(null);
  const thirdMaterialReference = useRef(null);
  const groupRef = useRef(null);
  const [dataRotation] = useState({ x: 0, y: 0 });
  const [dataBW] = useState({ isDark: false });
  const { BWMode, activeRotation, activeLayers, layersDistance, customMask } =
    useControls("Texture Settings", {
      BWMode: false,
      activeRotation: true,
      activeLayers: true,
      customMask: false,
      layersDistance: {
        value: 1,
        min: 1,
        max: 2,
      },
    });

  const onMouseMoveHandler = (event) => {
    dataRotation.x =
      0.075 * -(event.clientX / document.body.offsetWidth - 0.5) * 2;
    dataRotation.y =
      0.075 * -(event.clientY / document.body.offsetHeight - 0.5) * 2;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMoveHandler);

    return () => window.removeEventListener("mousemove", onMouseMoveHandler);
  }, []);

  useFrame((state) => {
    //Animate alpha mask in front layers
    secondaryMaterialReference.current.uTime = state.clock.elapsedTime;
    thirdMaterialReference.current.uTime = -state.clock.elapsedTime;

    const difference =
      Math.abs(offset.x) -
      Math.abs(mainPlaneMaterialReference.current.uniforms.uOffsetX.value);

    //Detect if the slider is moving
    if (difference > 0.5) {
      offset.isMoving = 1;
    } else {
      offset.isMoving = 0;
    }

    //Animate wave noise slider movement
    const directionWave = offset.isMoving * offset.noiseDirection;
    mainPlaneMaterialReference.current.uNoiseX = THREE.MathUtils.lerp(
      mainPlaneMaterialReference.current.uniforms.uNoiseX.value,
      directionWave,
      0.08
    );
    secondaryMaterialReference.current.uNoiseX = THREE.MathUtils.lerp(
      secondaryMaterialReference.current.uniforms.uNoiseX.value,
      directionWave,
      0.08
    );
    thirdMaterialReference.current.uNoiseX = THREE.MathUtils.lerp(
      thirdMaterialReference.current.uniforms.uNoiseX.value,
      directionWave,
      0.08
    );

    //Animating uv.x coordinate so we create the movement effect in the texture
    mainPlaneMaterialReference.current.uOffsetX = THREE.MathUtils.lerp(
      mainPlaneMaterialReference.current.uniforms.uOffsetX.value,
      offset.x,
      0.07
    );
    secondaryMaterialReference.current.uOffsetX = THREE.MathUtils.lerp(
      secondaryMaterialReference.current.uniforms.uOffsetX.value,
      offset.x,
      0.07
    );
    thirdMaterialReference.current.uOffsetX = THREE.MathUtils.lerp(
      thirdMaterialReference.current.uniforms.uOffsetX.value,
      offset.x,
      0.07
    );

    //Animating the layers for the 3d effect on the image

    secondaryMaterialReference.current.uActiveLayers = THREE.MathUtils.lerp(
      secondaryMaterialReference.current.uniforms.uActiveLayers.value,
      activeLayers ? 1.0 : 0.0,
      0.075
    );

    thirdMaterialReference.current.uActiveLayers = THREE.MathUtils.lerp(
      thirdMaterialReference.current.uniforms.uActiveLayers.value,
      activeLayers ? 1.0 : 0.0,
      0.075
    );

    secondaryMaterialReference.current.uPatron = THREE.MathUtils.lerp(
      secondaryMaterialReference.current.uniforms.uPatron.value,
      customMask ? 1.0 : 0.0,
      0.075
    );

    thirdMaterialReference.current.uPatron = THREE.MathUtils.lerp(
      thirdMaterialReference.current.uniforms.uPatron.value,
      customMask ? 1.0 : 0.0,
      0.075
    );

    //Getting the current size for the images according to the viewport size

    const { width, height } = viewport.getCurrentViewport(camera, [
      mainPlaneReference.current.position.x,
      mainPlaneReference.current.position.y,
      mainPlaneReference.current.position.z,
    ]);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      activeRotation ? dataRotation.y : 0.0,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      activeRotation ? dataRotation.x : 0.0,
      0.05
    );

    //animate the bW Mode

    dataBW.isDark = BWMode ? 0.0 : 1.0;

    groupRef.current.children.forEach((element) => {
      element.material.uniforms.uMouseX.value = THREE.MathUtils.lerp(
        element.material.uniforms.uMouseX.value,
        dataBW.isDark,
        0.05
      );

      element.scale.set(width * 1.2, height * 1.2, 1);

      element.material.uniforms.uTextureSize.value = new THREE.Vector2(
        1000,
        1000
      );

      element.material.uniforms.uQuadSize.value = new THREE.Vector2(
        element.scale.x,
        element.scale.y
      );
    });
  });
  return (
    <>
      <group ref={groupRef} position-z={-1}>
        <mesh ref={mainPlaneReference} position-z={0}>
          <planeGeometry />
          <mainPlaneMaterial ref={mainPlaneMaterialReference} transparent />
        </mesh>
        <mesh position-z={0.5 * layersDistance}>
          <planeGeometry />
          <secondaryPlaneMaterial transparent ref={thirdMaterialReference} />
        </mesh>
        <mesh position-z={1 * layersDistance}>
          <planeGeometry />
          <secondaryPlaneMaterial
            transparent
            ref={secondaryMaterialReference}
          />
        </mesh>
      </group>
    </>
  );
};

export default ThreeComponent;
