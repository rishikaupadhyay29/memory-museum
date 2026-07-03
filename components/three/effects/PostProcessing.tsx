"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMuseumStore } from "@/store/museumStore";

export function PostProcessing() {
  const qualitySettings = useMuseumStore((s) => s.qualitySettings);
  const activeScene = useMuseumStore((s) => s.activeScene);

  // Tighter DOF focus inside exhibit view.
  const isExhibit = activeScene === "exhibit";

  if (!qualitySettings.bloom && !qualitySettings.depthOfField) {
    // Only vignette on low tier.
    return (
      <EffectComposer multisampling={0}>
        <Vignette
          offset={0.4}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={qualitySettings.antialiasSamples}>
      {qualitySettings.bloom && (
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      )}
      {qualitySettings.depthOfField && isExhibit && (
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.04}
          bokehScale={2}
          height={480}
        />
      )}
      <Vignette
        offset={0.35}
        darkness={0.65}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
