"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Image, Video, Mic, BookOpen, Upload, X, CheckCircle2, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/primitives/Button";
import { GlassPanel } from "@/components/ui/primitives/GlassPanel";
import { Badge } from "@/components/ui/primitives/Badge";
import { cn, formatBytes } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type MemoryType = "image" | "video" | "audio" | "journal";

interface UploadType {
  id: MemoryType;
  label: string;
  description: string;
  icon: React.ElementType;
  accept: string;
  formats: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const UPLOAD_TYPES: UploadType[] = [
  {
    id: "image",
    label: "Images",
    description: "Photos and pictures",
    icon: Image,
    accept: "image/*",
    formats: "JPG, PNG, WEBP, HEIC",
  },
  {
    id: "video",
    label: "Videos",
    description: "Moments in motion",
    icon: Video,
    accept: "video/*",
    formats: "MP4, MOV, WEBM",
  },
  {
    id: "audio",
    label: "Audio",
    description: "Voice recordings",
    icon: Mic,
    accept: "audio/*",
    formats: "MP3, WAV, M4A",
  },
  {
    id: "journal",
    label: "Journal Entry",
    description: "Written memories",
    icon: BookOpen,
    accept: ".txt,.pdf",
    formats: "TXT, PDF",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

interface SelectedFile {
  file: File;
  detectedType: MemoryType;
}

function detectMemoryType(file: File): MemoryType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "text/plain" || file.type === "application/pdf") return "journal";
  return "image";
}

const TYPE_LABELS: Record<MemoryType, string> = {
  image: "Image",
  video: "Video",
  audio: "Audio",
  journal: "Journal Entry",
};

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UploadMemoryPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<MemoryType>("image");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeType = UPLOAD_TYPES.find((t) => t.id === selectedType);

  if (!activeType) {
    return null;
  }

  function acceptFile(file: File) {
    const detectedType = detectMemoryType(file);
    setSelectedFile({ file, detectedType });
    setSelectedType(detectedType);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) acceptFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
    e.target.value = "";
  }

  function handleZoneClick() {
    fileInputRef.current?.click();
  }

  function clearFile() {
    setSelectedFile(null);
  }

  return (
    <main className="min-h-dvh flex items-start justify-center px-4 py-16 md:py-24">
      <div className="w-full max-w-2xl space-y-8">
        {/* Hidden file input — triggered by drop zone click */}
        <input
          ref={fileInputRef}
          type="file"
          accept={activeType.accept}
          className="sr-only"
          aria-hidden
          onChange={handleInputChange}
        />

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2"
        >
          <Badge variant="gold">New Memory</Badge>
          <h1 className="font-display text-4xl md:text-5xl text-museum-marble leading-tight mt-3">
            Upload Memory
          </h1>
          <p className="text-museum-mist font-body text-base leading-relaxed max-w-md">
            Every museum begins with its first memory. Choose what you would like to preserve, and
            we will build something beautiful around it.
          </p>
        </motion.div>

        {/* ── Memory type selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-label text-xs mb-3">Memory type</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {UPLOAD_TYPES.map((type, i) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <motion.button
                  key={type.id}
                  custom={i}
                  variants={FADE_UP}
                  initial="hidden"
                  animate="show"
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-2.5 rounded-museum p-4",
                    "border transition-all duration-300 text-center group",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-museum-gold/60",
                    isSelected
                      ? "bg-museum-gold/10 border-museum-gold/50 shadow-[0_0_20px_rgba(201,160,77,0.12)]"
                      : "glass border-museum-gold/12 hover:border-museum-gold/30 hover:bg-white/5"
                  )}
                  aria-pressed={isSelected}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <CheckCircle2 className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-museum-gold" />
                  )}

                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300",
                      isSelected ? "bg-museum-gold/20" : "bg-white/5 group-hover:bg-museum-gold/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        isSelected
                          ? "text-museum-gold"
                          : "text-museum-mist group-hover:text-museum-gold/80"
                      )}
                    />
                  </div>

                  <div>
                    <p
                      className={cn(
                        "text-sm font-body font-medium leading-none mb-1 transition-colors duration-300",
                        isSelected ? "text-museum-marble" : "text-museum-mist"
                      )}
                    >
                      {type.label}
                    </p>
                    <p className="text-xs text-museum-mist/60 leading-none">{type.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Drop zone ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative rounded-museum border-2 border-dashed transition-all duration-300",
              "flex flex-col items-center justify-center gap-4 py-16 px-8 text-center cursor-pointer",
              isDragging
                ? "border-museum-gold/70 bg-museum-gold/8 scale-[1.01]"
                : "border-museum-gold/20 hover:border-museum-gold/40 hover:bg-white/[0.02]"
            )}
            role="button"
            aria-label={`Drop ${activeType.label.toLowerCase()} here or click to browse`}
            tabIndex={0}
            onClick={handleZoneClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleZoneClick();
            }}
          >
            {/* Ambient glow when dragging */}
            {isDragging && (
              <div
                aria-hidden
                className="absolute inset-0 rounded-museum pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,160,77,0.07) 0%, transparent 70%)",
                }}
              />
            )}

            <div
              className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300",
                isDragging ? "bg-museum-gold/20 scale-110" : "bg-white/5"
              )}
            >
              <Upload
                className={cn(
                  "w-7 h-7 transition-colors duration-300",
                  isDragging ? "text-museum-gold" : "text-museum-mist/60"
                )}
              />
            </div>
            <div className="space-y-1.5">
              <p className="font-body text-museum-marble text-base font-medium">
                {isDragging
                  ? `Release to add your ${activeType.label.toLowerCase()}`
                  : `Drop your ${activeType.label.toLowerCase()} here`}
              </p>
              <p className="text-museum-mist/60 text-sm font-body">
                or{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoneClick();
                  }}
                  className="text-museum-gold underline underline-offset-2 cursor-pointer hover:text-museum-gold-light transition-colors"
                >
                  browse from your device
                </button>
              </p>
            </div>

            <p className="text-xs text-museum-mist/40 font-body">
              {activeType.formats} · Up to 500 MB
            </p>
          </div>
        </motion.div>

        {/* ── Selected file preview ── */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassPanel padding="md" className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-museum-gold/15 flex items-center justify-center flex-shrink-0">
                <FileCheck2 className="w-5 h-5 text-museum-gold" />
              </div>

              {/* File details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-museum-marble font-medium truncate">
                  {selectedFile.file.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-museum-mist font-body">
                    {formatBytes(selectedFile.file.size)}
                  </span>
                  <span className="text-museum-gold/30" aria-hidden>
                    ·
                  </span>
                  <Badge variant="gold">{TYPE_LABELS[selectedFile.detectedType]}</Badge>
                </div>
              </div>

              {/* Clear */}
              <button
                type="button"
                onClick={clearFile}
                className="text-museum-mist hover:text-museum-marble transition-colors flex-shrink-0 p-1 rounded"
                aria-label="Remove selected file"
              >
                <X className="w-4 h-4" />
              </button>
            </GlassPanel>
          </motion.div>
        )}

        {/* ── Supported formats ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          <GlassPanel padding="sm" className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-museum-mist/60 font-body mr-1">Supported formats:</span>
            {UPLOAD_TYPES.map((type) => (
              <Badge
                key={type.id}
                variant={type.id === selectedType ? "gold" : "mist"}
                className="transition-all duration-200"
              >
                {type.formats}
              </Badge>
            ))}
          </GlassPanel>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between pt-2"
        >
          <Button variant="ghost" size="md" onClick={() => router.push("/museum")}>
            <X className="w-4 h-4" />
            Cancel
          </Button>

          <Button
            variant="gold"
            size="md"
            disabled={!selectedFile}
            title={selectedFile ? "Continue to add details" : "Select a file to continue"}
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
