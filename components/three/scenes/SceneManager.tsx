"use client";

import { Suspense } from "react";
import { useMuseumStore } from "@/store/museumStore";
import { LobbyScene } from "./LobbyScene";
import { WingScene } from "./WingScene";
import { ExhibitScene } from "./ExhibitScene";
import { SuspenseFallback } from "../loaders/SuspenseFallback";

/**
 * SceneManager lives inside the persistent R3F Canvas.
 * It reads museumStore.activeScene and renders the corresponding scene.
 * Scenes are never unmounted via routing — only the active scene changes.
 * This keeps camera state, physics, and particle systems alive across navigation.
 */
export function SceneManager() {
  const activeScene = useMuseumStore((s) => s.activeScene);
  const activeWingId = useMuseumStore((s) => s.activeWingId);
  const activeExhibitId = useMuseumStore((s) => s.activeExhibitId);

  return (
    <Suspense fallback={<SuspenseFallback />}>
      {activeScene === "lobby" && <LobbyScene />}

      {activeScene === "wing" && activeWingId && (
        <WingScene wingId={activeWingId} />
      )}

      {activeScene === "exhibit" && activeExhibitId && (
        <ExhibitScene exhibitId={activeExhibitId} />
      )}

      {/* constellation and hidden room scenes added in later build phases */}
    </Suspense>
  );
}
