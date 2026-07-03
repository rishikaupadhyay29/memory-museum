"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { useMuseumStore } from "@/store/museumStore";
import { cn } from "@/lib/utils";

const SCENE_LABELS: Record<string, string> = {
  lobby: "Entrance Hall",
  wing: "Wing",
  exhibit: "Exhibit",
  constellation: "Memory Constellation",
  hidden: "Hidden Room",
};

export function BreadcrumbCompass() {
  const activeScene = useMuseumStore((s) => s.activeScene);
  const navigateToLobby = useMuseumStore((s) => s.navigateToLobby);
  const isTransitioning = useMuseumStore((s) => s.isTransitioning);

  const crumbs: Array<{ label: string; onClick?: () => void }> = [
    {
      label: "Museum",
      onClick: activeScene !== "lobby" ? navigateToLobby : undefined,
    },
  ];

  if (activeScene !== "lobby") {
    crumbs.push({ label: SCENE_LABELS[activeScene] ?? activeScene });
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: isTransitioning ? 0.4 : 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Museum navigation"
      className="flex items-center gap-1.5"
    >
      <AnimatePresence mode="wait">
        {crumbs.map((crumb, i) => (
          <motion.span
            key={crumb.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="flex items-center gap-1.5"
          >
            {i === 0 && (
              <Home className="w-3 h-3 text-museum-gold/60 flex-shrink-0" aria-hidden />
            )}
            {i > 0 && (
              <ChevronRight
                className="w-3 h-3 text-museum-gold/30 flex-shrink-0"
                aria-hidden
              />
            )}
            <button
              onClick={crumb.onClick}
              disabled={!crumb.onClick}
              className={cn(
                "text-xs tracking-wider uppercase font-body transition-colors duration-200",
                crumb.onClick
                  ? "text-museum-mist hover:text-museum-gold cursor-pointer"
                  : "text-museum-marble cursor-default"
              )}
            >
              {crumb.label}
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.nav>
  );
}
