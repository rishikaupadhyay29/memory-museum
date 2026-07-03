"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useMuseumStore } from "@/store/museumStore";
import { MuseumHUD } from "./MuseumHUD";
import { detectQualityTier } from "@/lib/performance";

/**
 * CanvasRoot is imported with ssr:false — WebGL must never run during SSR.
 * The loading state shows the museum-branded spinner defined in SuspenseFallback.
 */
const CanvasRoot = dynamic(() => import("./CanvasRoot"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-museum-obsidian flex items-center justify-center z-0">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <svg
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "3s" }}
            viewBox="0 0 56 56"
            fill="none"
          >
            <circle cx="28" cy="28" r="24" stroke="rgba(201,160,77,0.12)" strokeWidth="2" />
            <path
              d="M28 4 A24 24 0 0 1 52 28"
              stroke="rgba(201,160,77,0.75)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-museum-gold animate-breathe" />
          </div>
        </div>
        <p
          className="text-xs tracking-widest uppercase font-body"
          style={{ color: "rgba(201,160,77,0.55)" }}
        >
          Opening the museum…
        </p>
      </div>
    </div>
  ),
});

/**
 * Route → store sync map.
 * Parses the Next.js pathname and fires the appropriate museumStore navigation action.
 */
function useRouteSync() {
  const pathname = usePathname();
  const navigateToLobby = useMuseumStore((s) => s.navigateToLobby);
  const navigateToWing = useMuseumStore((s) => s.navigateToWing);
  const navigateToExhibit = useMuseumStore((s) => s.navigateToExhibit);
  const navigateToConstellation = useMuseumStore((s) => s.navigateToConstellation);
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    // Skip on first render — lobby is already the default store state.
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // /museum/constellation
    if (pathname === "/museum/constellation") {
      navigateToConstellation();
      return;
    }

    // /museum/[wingId]/[exhibitId]
    const exhibitMatch = pathname.match(/^\/museum\/([^/]+)\/([^/]+)$/);
    if (exhibitMatch) {
      const [, wingId, exhibitId] = exhibitMatch;
      if (wingId && exhibitId) {
        navigateToExhibit(exhibitId, wingId);
        return;
      }
    }

    // /museum/[wingId]
    const wingMatch = pathname.match(/^\/museum\/([^/]+)$/);
    if (wingMatch) {
      const [, wingId] = wingMatch;
      if (wingId) {
        navigateToWing(wingId);
        return;
      }
    }

    // /museum (lobby)
    if (pathname === "/museum") {
      navigateToLobby();
    }
  }, [pathname, navigateToLobby, navigateToWing, navigateToExhibit, navigateToConstellation]);
}

/**
 * Detects GPU quality tier on mount and writes it to the store.
 * Runs once — subsequent visits within the session reuse the cached result.
 */
function useQualityInit() {
  const setQualityTier = useMuseumStore((s) => s.setQualityTier);
  const hasInit = useRef(false);

  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    detectQualityTier().then((tier) => {
      setQualityTier(tier);
    });
  }, [setQualityTier]);
}

interface MuseumShellProps {
  /** Route page content — rendered as a glassmorphic DOM overlay */
  children: React.ReactNode;
}

export function MuseumShell({ children }: MuseumShellProps) {
  useRouteSync();
  useQualityInit();

  return (
    <>
      {/* Fixed 3D canvas — position:fixed, z-index:0, never unmounts */}
      <CanvasRoot />

      {/* DOM HUD layer — z-index:20, pointer-events managed per child */}
      <MuseumHUD>{children}</MuseumHUD>
    </>
  );
}
