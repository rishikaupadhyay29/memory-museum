"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BreadcrumbCompass } from "@/components/ui/navigation/BreadcrumbCompass";
import { MuseumMap } from "@/components/ui/navigation/MuseumMap";
import { AudioToggle } from "./AudioToggle";
import { ExhibitInfoPanel } from "./ExhibitInfoPanel";
import { useMuseumStore } from "@/store/museumStore";

/**
 * MuseumHUD — the entire DOM overlay rendered on top of the 3D canvas.
 *
 * Layout zones:
 * ┌───────────────────────────────────────┐
 * │ BreadcrumbCompass      [Map] [Audio]  │  ← top bar
 * │                                       │
 * │               (canvas)                │
 * │                                       │
 * │                       ExhibitPanel    │  ← bottom-right
 * └───────────────────────────────────────┘
 *
 * pointer-events: none on the container; re-enabled per interactive child
 * so mouse events reach the 3D canvas through the empty areas.
 */
export function MuseumHUD({ children }: { children?: React.ReactNode }) {
  const isTransitioning = useMuseumStore((s) => s.isTransitioning);

  return (
    <div className="hud-overlay" aria-label="Museum interface">
      {/* ── Transition veil — fades over scene changes ── */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="transition-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 bg-museum-obsidian/70 pointer-events-none z-10"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-5 pointer-events-auto">
        {/* Left: breadcrumb */}
        <div className="glass border-gold rounded-lg px-3 py-2">
          <BreadcrumbCompass />
        </div>

        {/* Right: map + audio */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <MuseumMap />
          </div>
          <AudioToggle />
        </div>
      </div>

      {/* ── Bottom-right: exhibit info panel ── */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <ExhibitInfoPanel />
      </div>

      {/* ── Route-level content (create flow, settings overlaid as panels) ── */}
      {children && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
