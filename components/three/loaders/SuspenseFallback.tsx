"use client";

import { Html } from "@react-three/drei";

export function SuspenseFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <svg
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "3s" }}
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(201,160,77,0.15)"
              strokeWidth="2"
            />
            <path
              d="M32 4 A28 28 0 0 1 60 32"
              stroke="rgba(201,160,77,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {/* Inner dot */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div className="w-2 h-2 rounded-full bg-museum-gold animate-breathe" />
          </div>
        </div>
        <p className="text-label text-xs" style={{ color: "rgba(201,160,77,0.6)" }}>
          Opening the museum&hellip;
        </p>
      </div>
    </Html>
  );
}
