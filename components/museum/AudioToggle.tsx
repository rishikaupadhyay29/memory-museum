"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useMuseumStore } from "@/store/museumStore";
import { cn } from "@/lib/utils";

export function AudioToggle() {
  const audioEnabled = useMuseumStore((s) => s.audioEnabled);
  const setAudioEnabled = useMuseumStore((s) => s.setAudioEnabled);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setAudioEnabled(!audioEnabled)}
      className={cn(
        "glass border-gold rounded-full p-2.5",
        "hover:border-museum-gold/40 transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-museum-gold/60"
      )}
      aria-label={audioEnabled ? "Mute ambient audio" : "Enable ambient audio"}
      title={audioEnabled ? "Mute audio" : "Enable audio"}
    >
      {audioEnabled ? (
        <Volume2 className="w-4 h-4 text-museum-gold" />
      ) : (
        <VolumeX className="w-4 h-4 text-museum-mist" />
      )}
    </motion.button>
  );
}
