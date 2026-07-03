"use client";

export type QualityTier = "low" | "medium" | "high";

export interface QualitySettings {
  tier: QualityTier;
  /** Max particles per system */
  particleCount: number;
  /** Shadow map resolution (power of 2) */
  shadowMapSize: number;
  /** Enable depth-of-field post-processing */
  depthOfField: boolean;
  /** Enable bloom post-processing */
  bloom: boolean;
  /** Enable ambient occlusion */
  ambientOcclusion: boolean;
  /** Texture resolution multiplier (0.5, 0.75, 1.0) */
  textureScale: number;
  /** Maximum draw distance */
  farPlane: number;
  /** Whether to use instanced rendering for repeated objects */
  useInstancing: boolean;
  /** Anti-aliasing samples (1 = off) */
  antialiasSamples: number;
}

export const QUALITY_PRESETS: Record<QualityTier, QualitySettings> = {
  low: {
    tier: "low",
    particleCount: 200,
    shadowMapSize: 512,
    depthOfField: false,
    bloom: false,
    ambientOcclusion: false,
    textureScale: 0.5,
    farPlane: 80,
    useInstancing: true,
    antialiasSamples: 1,
  },
  medium: {
    tier: "medium",
    particleCount: 800,
    shadowMapSize: 1024,
    depthOfField: false,
    bloom: true,
    ambientOcclusion: false,
    textureScale: 0.75,
    farPlane: 150,
    useInstancing: true,
    antialiasSamples: 4,
  },
  high: {
    tier: "high",
    particleCount: 2000,
    shadowMapSize: 2048,
    depthOfField: true,
    bloom: true,
    ambientOcclusion: true,
    textureScale: 1.0,
    farPlane: 300,
    useInstancing: true,
    antialiasSamples: 8,
  },
};

/**
 * Probe the device's GPU capability by running a brief benchmark.
 * Returns a quality tier based on detected hardware performance.
 */
export async function detectQualityTier(): Promise<QualityTier> {
  if (typeof window === "undefined") return "medium";

  // Check for explicit user override stored in localStorage.
  const stored = localStorage.getItem("mm_quality_tier") as QualityTier | null;
  if (stored && ["low", "medium", "high"].includes(stored)) {
    return stored;
  }

  // Check device memory (Chrome/Edge only).
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory !== undefined) {
    if (nav.deviceMemory <= 2) return "low";
    if (nav.deviceMemory <= 4) return "medium";
  }

  // Check hardware concurrency (CPU cores as proxy).
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores <= 2) return "low";
  if (cores <= 4) return "medium";

  // Check for mobile user agent.
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) return "medium";

  // WebGL renderer string heuristic.
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "low";

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
      const lowEndKeywords = ["intel hd", "mali-4", "adreno 3", "sgx", "apple a8", "apple a9"];
      const isLowEnd = lowEndKeywords.some((kw) => renderer.toLowerCase().includes(kw));
      if (isLowEnd) return "low";
    }

    // If WebGL2 available and no low-end indicators, default to high.
    if (canvas.getContext("webgl2")) return "high";
  } catch {
    return "medium";
  }

  return "medium";
}

/**
 * Persist the user's chosen quality tier override.
 */
export function setQualityTierOverride(tier: QualityTier): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("mm_quality_tier", tier);
}

/**
 * FPS monitor. Tracks rolling average frame rate and fires a callback
 * when performance drops below a threshold so the SceneManager can
 * automatically reduce quality.
 */
export class FPSMonitor {
  private frameTimes: number[] = [];
  private lastFrame: number = performance.now();
  private rafId: number | null = null;
  private readonly windowSize = 60; // rolling 60-frame average
  private readonly onDrop: (fps: number) => void;
  private readonly dropThreshold: number;

  constructor(onDrop: (fps: number) => void, dropThreshold = 28) {
    this.onDrop = onDrop;
    this.dropThreshold = dropThreshold;
  }

  start(): void {
    const tick = () => {
      const now = performance.now();
      const delta = now - this.lastFrame;
      this.lastFrame = now;
      this.frameTimes.push(delta);
      if (this.frameTimes.length > this.windowSize) this.frameTimes.shift();

      const avgDelta =
        this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      const fps = 1000 / avgDelta;

      if (this.frameTimes.length === this.windowSize && fps < this.dropThreshold) {
        this.onDrop(fps);
      }

      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getAverageFPS(): number {
    if (this.frameTimes.length === 0) return 60;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    return 1000 / avg;
  }
}
