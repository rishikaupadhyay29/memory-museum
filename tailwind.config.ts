import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        museum: {
          obsidian: "#0a0908",
          charcoal: "#15130f",
          ink: "#1c1a16",
          gold: {
            DEFAULT: "#c9a04d",
            light: "#e6c878",
            dark: "#8a6d2f",
            glow: "#f5d98a",
          },
          marble: "#e8e2d4",
          mist: "#9c958a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backdropBlur: {
        glass: "20px",
      },
      boxShadow: {
        gold: "0 0 40px rgba(201, 160, 77, 0.25)",
        "glass-inset": "inset 0 1px 0 rgba(255,255,255,0.08)",
        elevated: "0 20px 60px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        museum: "1.25rem",
      },
      animation: {
        breathe: "breathe 6s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
