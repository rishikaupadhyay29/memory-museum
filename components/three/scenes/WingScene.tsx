"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMuseumStore } from "@/store/museumStore";

// ── Exhibit Pedestal ─────────────────────────────────────────────────────────

interface PedestalProps {
  position: [number, number, number];
  exhibitId: string;
  label: string;
  isActive?: boolean;
}

function ExhibitPedestal({ position, exhibitId, label, isActive }: PedestalProps) {
  const setFocused = useMuseumStore((s) => s.setFocusedObject);
  const navigateToExhibit = useMuseumStore((s) => s.navigateToExhibit);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!glowRef.current) return;
    glowRef.current.intensity =
      0.4 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.15;
  });

  return (
    <group
      position={position}
      onClick={() => navigateToExhibit(exhibitId)}
      onPointerEnter={() => setFocused(exhibitId)}
      onPointerLeave={() => setFocused(null)}
    >
      {/* Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.08, 0.8]} />
        <meshStandardMaterial
          color={isActive ? "#c9a04d" : "#1a1814"}
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>
      {/* Shaft */}
      <mesh castShadow position={[0, 0.65, 0]}>
        <boxGeometry args={[0.22, 1.2, 0.22]} />
        <meshStandardMaterial color="#15130f" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Top plate */}
      <mesh castShadow position={[0, 1.32, 0]}>
        <boxGeometry args={[0.7, 0.06, 0.7]} />
        <meshStandardMaterial
          color="#c9a04d"
          roughness={0.3}
          metalness={0.7}
          emissive={isActive ? "#8a6d2f" : "#000000"}
          emissiveIntensity={isActive ? 0.5 : 0}
        />
      </mesh>
      {/* Glow above pedestal */}
      <pointLight
        ref={glowRef}
        position={[0, 2.4, 0]}
        intensity={0.4}
        color="#e6c878"
        distance={5}
        decay={2}
      />
    </group>
  );
}

// ── Wing Scene ───────────────────────────────────────────────────────────────

interface WingSceneProps {
  wingId: string;
}

export function WingScene({ wingId: _wingId }: WingSceneProps) {
  // Pedestal layout grid — 3 rows × 2 columns for up to 6 exhibits.
  const pedestalSlots: Array<[number, number, number]> = [
    [-4, 0, -4], [4, 0, -4],
    [-4, 0,  2], [4, 0,  2],
    [-4, 0,  8], [4, 0,  8],
  ];

  // Placeholder exhibits; replaced by real data once the API layer is live.
  const placeholderExhibits = pedestalSlots.map((pos, i) => ({
    position: pos,
    id: `placeholder_${i}`,
    label: `Exhibit ${i + 1}`,
  }));

  return (
    <group>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.12} color="#c9a04d" />
      <directionalLight
        position={[0, 14, 2]}
        intensity={0.9}
        color="#e6c878"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 8, -10]} intensity={0.5} color="#9c8a6d" distance={20} />

      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 24]} />
        <meshStandardMaterial color="#0d0b09" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* ── Ceiling ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 9, 0]}>
        <planeGeometry args={[20, 24]} />
        <meshStandardMaterial color="#0d0b09" roughness={0.9} />
      </mesh>

      {/* ── Walls ── */}
      <mesh position={[0, 4.5, -12]} receiveShadow>
        <planeGeometry args={[20, 9]} />
        <meshStandardMaterial color="#111009" roughness={0.8} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-10, 4.5, 0]} receiveShadow>
        <planeGeometry args={[24, 9]} />
        <meshStandardMaterial color="#111009" roughness={0.8} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[10, 4.5, 0]} receiveShadow>
        <planeGeometry args={[24, 9]} />
        <meshStandardMaterial color="#111009" roughness={0.8} />
      </mesh>

      {/* ── Exhibit Pedestals ── */}
      {placeholderExhibits.map((exhibit) => (
        <ExhibitPedestal
          key={exhibit.id}
          position={exhibit.position}
          exhibitId={exhibit.id}
          label={exhibit.label}
        />
      ))}

      {/* ── Wall-mounted light sconces ── */}
      {[-8, 8].map((x) =>
        [-6, 0, 6].map((z) => (
          <pointLight
            key={`${x}-${z}`}
            position={[x * 0.9, 5.5, z]}
            intensity={0.3}
            color="#e6c878"
            distance={8}
            decay={2}
          />
        ))
      )}

      <Environment preset="night" />
      <fog attach="fog" args={["#0a0908", 14, 35]} />
    </group>
  );
}
