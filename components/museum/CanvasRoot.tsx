"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { SceneManager } from "@/components/three/scenes/SceneManager";
import { CameraRig } from "@/components/three/controls/CameraRig";
import { PostProcessing } from "@/components/three/effects/PostProcessing";
import { AssetPreloader } from "@/components/three/loaders/AssetPreloader";
import { useMuseumStore } from "@/store/museumStore";

/**
 * CanvasRoot — imported with { ssr: false } from MuseumShell.
 *
 * This is mounted once when the user enters any /museum route and
 * never unmounts until they navigate away from the (museum) group.
 * Scenes swap internally via SceneManager + Zustand; no WebGL context
 * is destroyed between wing/exhibit navigations.
 */
export default function CanvasRoot() {
  const frameloop = useMuseumStore((s) => s.frameloop);
  const qualitySettings = useMuseumStore((s) => s.qualitySettings);

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, qualitySettings.textureScale === 1 ? 2 : 1.5]}
      gl={{
        antialias: qualitySettings.antialiasSamples > 1,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      shadows={qualitySettings.shadowMapSize > 0}
      camera={{
        fov: 65,
        near: 0.1,
        far: qualitySettings.farPlane,
        position: [0, 1.7, 8],
      }}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      aria-label="Memory Museum 3D environment"
    >
      {/* Decoder/loader setup — runs once, shared by all scenes */}
      <AssetPreloader />

      {/* Camera movement + controls */}
      <CameraRig />

      {/* Active scene (lobby | wing | exhibit | constellation | hidden) */}
      <SceneManager />

      {/* Post-processing (bloom, DOF, vignette) — quality-gated internally */}
      <PostProcessing />

      {/* R3F adaptive helpers — reduce DPR on frame-rate drop */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
