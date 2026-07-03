"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useMuseumStore } from "@/store/museumStore";
import { GlassPanel } from "@/components/ui/primitives/GlassPanel";
import { Button } from "@/components/ui/primitives/Button";
import { Badge } from "@/components/ui/primitives/Badge";

/**
 * Shown when the user focuses an exhibit pedestal in the wing scene.
 * In Phase 1 it renders placeholder content; real exhibit data is wired
 * once the TanStack Query hooks and API routes are live.
 */
export function ExhibitInfoPanel() {
  const isOpen = useMuseumStore((s) => s.isExhibitPanelOpen);
  const focusedObjectId = useMuseumStore((s) => s.focusedObjectId);
  const setExhibitPanelOpen = useMuseumStore((s) => s.setExhibitPanelOpen);
  const navigateToExhibit = useMuseumStore((s) => s.navigateToExhibit);
  const activeExhibitId = useMuseumStore((s) => s.activeExhibitId);

  // Show if an object is focused (hover) OR if we're inside an exhibit
  const visible = isOpen || !!focusedObjectId;
  const exhibitId = activeExhibitId ?? focusedObjectId;

  return (
    <AnimatePresence>
      {visible && exhibitId && (
        <motion.div
          key={exhibitId}
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <GlassPanel padding="md" className="relative">
            {/* Close — only when inside exhibit view */}
            {isOpen && (
              <button
                onClick={() => setExhibitPanelOpen(false)}
                className="absolute top-3 right-3 text-museum-mist hover:text-museum-marble transition-colors"
                aria-label="Close exhibit panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Label */}
            <Badge variant="gold" className="mb-3">Exhibit</Badge>

            {/* Title — placeholder; real data comes from useExhibitLoader */}
            <h2 className="text-display text-xl text-museum-marble mb-1 leading-snug">
              Untitled Exhibit
            </h2>
            <p className="text-xs text-museum-mist/80 font-body mb-4 leading-relaxed">
              Select this exhibit to explore the memories within.
            </p>

            {/* Gold divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-museum-gold/30 to-transparent mb-4" />

            {/* Meta */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-museum-mist font-body">0 memories</span>
              <Button
                variant="gold"
                size="sm"
                onClick={() => navigateToExhibit(exhibitId)}
              >
                Enter
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
