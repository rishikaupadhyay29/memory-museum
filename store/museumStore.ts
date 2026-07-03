import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { QualityTier, QualitySettings } from "@/lib/performance";
import { QUALITY_PRESETS } from "@/lib/performance";

export type SceneType = "lobby" | "wing" | "exhibit" | "constellation" | "hidden";

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

export interface MuseumState {
  // ── Scene ────────────────────────────────────────────────────────────────
  activeScene: SceneType;
  activeWingId: string | null;
  activeExhibitId: string | null;
  isTransitioning: boolean;
  previousScene: SceneType | null;

  // ── Camera ────────────────────────────────────────────────────────────────
  cameraTarget: CameraTarget | null;
  cameraMode: "first-person" | "orbit" | "cinematic";
  isCameraLocked: boolean;

  // ── Environment ───────────────────────────────────────────────────────────
  audioEnabled: boolean;
  ambientVolume: number;

  // ── Performance ───────────────────────────────────────────────────────────
  qualityTier: QualityTier;
  qualitySettings: QualitySettings;
  frameloop: "always" | "demand" | "never";

  // ── UI State ──────────────────────────────────────────────────────────────
  isMapOpen: boolean;
  isExhibitPanelOpen: boolean;
  focusedObjectId: string | null;

  // ── Actions ───────────────────────────────────────────────────────────────
  navigateToLobby: () => void;
  navigateToWing: (wingId: string) => void;
  navigateToExhibit: (exhibitId: string, wingId?: string) => void;
  navigateToConstellation: () => void;
  navigateToHiddenRoom: (roomId: string) => void;

  setTransitioning: (value: boolean) => void;
  setCameraTarget: (target: CameraTarget) => void;
  setCameraMode: (mode: MuseumState["cameraMode"]) => void;
  setCameraLocked: (locked: boolean) => void;

  setAudioEnabled: (enabled: boolean) => void;
  setAmbientVolume: (volume: number) => void;

  setQualityTier: (tier: QualityTier) => void;
  setFrameloop: (loop: MuseumState["frameloop"]) => void;

  setMapOpen: (open: boolean) => void;
  setExhibitPanelOpen: (open: boolean) => void;
  setFocusedObject: (id: string | null) => void;
}

export const useMuseumStore = create<MuseumState>()(
  subscribeWithSelector((set) => ({
    // ── Initial State ─────────────────────────────────────────────────────
    activeScene: "lobby",
    activeWingId: null,
    activeExhibitId: null,
    isTransitioning: false,
    previousScene: null,

    cameraTarget: null,
    cameraMode: "first-person",
    isCameraLocked: false,

    audioEnabled: true,
    ambientVolume: 0.4,

    qualityTier: "medium",
    qualitySettings: QUALITY_PRESETS.medium,
    frameloop: "demand",

    isMapOpen: false,
    isExhibitPanelOpen: false,
    focusedObjectId: null,

    // ── Navigation ────────────────────────────────────────────────────────
    navigateToLobby: () =>
      set((state) => ({
        previousScene: state.activeScene,
        activeScene: "lobby",
        activeWingId: null,
        activeExhibitId: null,
        isTransitioning: true,
        isExhibitPanelOpen: false,
        focusedObjectId: null,
      })),

    navigateToWing: (wingId) =>
      set((state) => ({
        previousScene: state.activeScene,
        activeScene: "wing",
        activeWingId: wingId,
        activeExhibitId: null,
        isTransitioning: true,
        isExhibitPanelOpen: false,
        focusedObjectId: null,
      })),

    navigateToExhibit: (exhibitId, wingId) =>
      set((state) => ({
        previousScene: state.activeScene,
        activeScene: "exhibit",
        activeExhibitId: exhibitId,
        activeWingId: wingId ?? state.activeWingId,
        isTransitioning: true,
        isExhibitPanelOpen: true,
        frameloop: "always", // keep rendering during exhibit view
      })),

    navigateToConstellation: () =>
      set((state) => ({
        previousScene: state.activeScene,
        activeScene: "constellation",
        activeWingId: null,
        activeExhibitId: null,
        isTransitioning: true,
        isExhibitPanelOpen: false,
      })),

    navigateToHiddenRoom: (roomId) =>
      set((state) => ({
        previousScene: state.activeScene,
        activeScene: "hidden",
        activeWingId: roomId,
        activeExhibitId: null,
        isTransitioning: true,
      })),

    // ── Camera ────────────────────────────────────────────────────────────
    setTransitioning: (value) => set({ isTransitioning: value }),
    setCameraTarget: (target) =>
      set({ cameraTarget: target, frameloop: "always" }),
    setCameraMode: (mode) => set({ cameraMode: mode }),
    setCameraLocked: (locked) => set({ isCameraLocked: locked }),

    // ── Environment ───────────────────────────────────────────────────────
    setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
    setAmbientVolume: (volume) => set({ ambientVolume: volume }),

    // ── Performance ───────────────────────────────────────────────────────
    setQualityTier: (tier) =>
      set({ qualityTier: tier, qualitySettings: QUALITY_PRESETS[tier] }),
    setFrameloop: (loop) => set({ frameloop: loop }),

    // ── UI ────────────────────────────────────────────────────────────────
    setMapOpen: (open) => set({ isMapOpen: open }),
    setExhibitPanelOpen: (open) => set({ isExhibitPanelOpen: open }),
    setFocusedObject: (id) => set({ focusedObjectId: id }),
  }))
);
