import React, { useState } from "react";
import { useControls } from "leva";
import {
  EffectComposer,
  Vignette,
  Bloom,
  Noise,
  Scanline,
  Glitch,
  ChromaticAberration,
  Grid,
  HueSaturation,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const Effects = () => {
  const [chromaValue] = useState({ x: 0.002, y: 0.002 });
  const { bloomIntensity, activeBloom } = useControls("Bloom Settings", {
    activeBloom: false,
    bloomIntensity: {
      value: 1.5,
      min: 0,
      max: 5,
    },
  });

  const { activeNoise } = useControls("Noise Settings", {
    activeNoise: false,
  });

  const { activeScanline, scanlineDensity } = useControls("Scanline Settings", {
    activeScanline: false,
    scanlineDensity: {
      value: 1.25,
      min: 0.5,
      max: 5,
    },
  });

  const { activechromaticAberration } = useControls("Chromatic Aberration", {
    activechromaticAberration: true,
  });

  const { activeGrid, gridScale, gridLineWidth } = useControls(
    "Grid Settings",
    {
      activeGrid: false,
      gridScale: {
        value: 1.0,
        min: 0,
        max: 10,
      },
      gridLineWidth: {
        value: 0.5,
        min: 0,
        max: 5,
      },
    }
  );

  const { activeHueSaturation, hueValue, saturationValue } = useControls(
    "Hue Saturation Settings",
    {
      activeHueSaturation: false,
      hueValue: {
        value: 0,
        min: 0,
        max: Math.PI * 2,
        step: 0.001,
      },
      saturationValue: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.001,
      },
    }
  );

  return (
    <>
      <EffectComposer>
        <Vignette offset={0.3} darkness={0.7} />
        {activeBloom && (
          <Bloom
            mipmapBlur
            levels={9}
            intensity={bloomIntensity}
            luminanceThreshold={0.2}
            luminanceSmoothing={1}
          />
        )}

        {activeNoise && <Noise premultiply />}

        {activeScanline && <Scanline density={scanlineDensity} />}

        {activechromaticAberration && (
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[chromaValue.x, chromaValue.y]}
            intensity={0}
          />
        )}

        {activeGrid && (
          <Grid
            blendFunction={BlendFunction.OVERLAY}
            scale={gridScale}
            lineWidth={gridLineWidth}
          />
        )}

        {activeHueSaturation && (
          <HueSaturation
            blendFunction={BlendFunction.NORMAL}
            hue={hueValue}
            saturation={saturationValue}
          />
        )}
      </EffectComposer>
    </>
  );
};

export default Effects;
