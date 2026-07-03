"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Map, X } from "lucide-react";
import { useMuseumStore } from "@/store/museumStore";
import { GlassPanel } from "@/components/ui/primitives/GlassPanel";
import { cn } from "@/lib/utils";

// Static wing layout — positions updated in Phase 2 (Progression system) when
// wings are dynamically generated. This represents the base museum map.
const WING_NODES = [
  { id: "lobby",       label: "Entrance",    x: 50,  y: 70, isLobby: true },
  { id: "travel",      label: "Travel",       x: 20,  y: 45 },
  { id: "family",      label: "Family",       x: 80,  y: 45 },
  { id: "childhood",   label: "Childhood",    x: 35,  y: 20 },
  { id: "milestones",  label: "Milestones",   x: 65,  y: 20 },
  { id: "future",      label: "Future Dreams", x: 50, y: 5  },
] as const;

const CONNECTIONS: Array<[string, string]> = [
  ["lobby", "travel"],
  ["lobby", "family"],
  ["travel", "childhood"],
  ["family", "milestones"],
  ["childhood", "future"],
  ["milestones", "future"],
];

export function MuseumMap() {
  const isOpen = useMuseumStore((s) => s.isMapOpen);
  const setMapOpen = useMuseumStore((s) => s.setMapOpen);
  const activeWingId = useMuseumStore((s) => s.activeWingId);
  const activeScene = useMuseumStore((s) => s.activeScene);
  const navigateToWing = useMuseumStore((s) => s.navigateToWing);
  const navigateToLobby = useMuseumStore((s) => s.navigateToLobby);

  const currentNodeId = activeScene === "lobby" ? "lobby" : (activeWingId ?? "lobby");

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setMapOpen(!isOpen)}
        className={cn(
          "glass border-gold rounded-full p-2.5",
          "hover:border-museum-gold/40 transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-museum-gold/60",
          isOpen && "border-museum-gold/40 bg-museum-gold/10"
        )}
        aria-label={isOpen ? "Close museum map" : "Open museum map"}
      >
        <Map className="w-4 h-4 text-museum-gold" />
      </motion.button>

      {/* Map panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-12 right-0 w-72"
          >
            <GlassPanel padding="md" className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-label text-xs">Museum Map</p>
                <button
                  onClick={() => setMapOpen(false)}
                  className="text-museum-mist hover:text-museum-marble transition-colors"
                  aria-label="Close map"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SVG map */}
              <div className="relative w-full aspect-square">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  aria-label="Museum layout map"
                >
                  {/* Connection lines */}
                  {CONNECTIONS.map(([a, b]) => {
                    const nodeA = WING_NODES.find((n) => n.id === a);
                    const nodeB = WING_NODES.find((n) => n.id === b);
                    if (!nodeA || !nodeB) return null;
                    return (
                      <line
                        key={`${a}-${b}`}
                        x1={nodeA.x}
                        y1={nodeA.y}
                        x2={nodeB.x}
                        y2={nodeB.y}
                        stroke="rgba(201,160,77,0.15)"
                        strokeWidth="0.8"
                      />
                    );
                  })}

                  {/* Wing nodes */}
                  {WING_NODES.map((node) => {
                    const isActive = node.id === currentNodeId;
                    const isLobby = "isLobby" in node && node.isLobby;
                    return (
                      <g
                        key={node.id}
                        onClick={() => {
                          if (isLobby) {
                            navigateToLobby();
                          } else {
                            navigateToWing(node.id);
                          }
                          setMapOpen(false);
                        }}
                        className="cursor-pointer"
                        role="button"
                        aria-label={`Navigate to ${node.label}`}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isLobby ? 5 : 3.5}
                          fill={isActive ? "#c9a04d" : "rgba(201,160,77,0.15)"}
                          stroke={isActive ? "#e6c878" : "rgba(201,160,77,0.35)"}
                          strokeWidth="0.8"
                        />
                        {isActive && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isLobby ? 8 : 6}
                            fill="none"
                            stroke="rgba(201,160,77,0.3)"
                            strokeWidth="0.6"
                          />
                        )}
                        <text
                          x={node.x}
                          y={node.y + (isLobby ? 9 : 7)}
                          textAnchor="middle"
                          fill={isActive ? "#e6c878" : "rgba(156,149,138,0.8)"}
                          fontSize="4.5"
                          fontFamily="Inter, sans-serif"
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <p className="text-xs text-museum-mist/60 text-center mt-2 font-body">
                Click a wing to navigate
              </p>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
