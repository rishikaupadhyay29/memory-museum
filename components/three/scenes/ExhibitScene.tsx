"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ── Photo Frame ──────────────────────────────────────────────────────────────

interface PhotoFrameProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  mediaUrl?: string;
}

function PhotoFrame({ position, rotation, mediaUrl: _mediaUrl }: PhotoFrameProps) {
  const frameRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!frameRef.current) return;
    // Subtle breathing / floating.
    frameRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.04;
  });

  return (
    <group ref={frameRef} position={position} rotation={rotation}>
      {/* Frame border */}
      <mesh castShadow>
        <boxGeometry args={[2.4, 1.8, 0.06]} />
        <meshStandardMaterial color="#c9a04d" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Photo plane */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[2.1, 1.5]} />
        <meshStandardMaterial
          color="#1a1814"
          roughness={0.9}
          metalness={0}
        />
      </mesh>
      {/* Spotlight on frame */}
      <spotLight
        position={[0, 5, 2]}
        target-position={[0, 0, 0]}
        intensity={1.8}
        color="#f5d98a"
        angle={0.35}
        penumbra={0.6}
        decay={2}
        castShadow
      />
    </group>
  );
}

// ── Exhibit Scene ─────────────────────────────────────────────────────────────

interface ExhibitSceneProps {
  exhibitId: string;
}

export function ExhibitScene({ exhibitId: _exhibitId }: ExhibitSceneProps) {
  return (
    <group>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.08} color="#c9a04d" />

      {/* ── Dark intimate room ── */}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#090807" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#09080700" roughness={1} />
      </mesh>

      {/* ── Featured exhibit frame — front and center ── */}
      <PhotoFrame position={[0, 2.5, -4]} />

      {/* ── Flanking frames (other memories in exhibit) ── */}
      <PhotoFrame
        position={[-3.8, 2.2, -3]}
        rotation={[0, Math.PI * 0.12, 0]}
      />
      <PhotoFrame
        position={[3.8, 2.2, -3]}
        rotation={[0, -Math.PI * 0.12, 0]}
      />

      {/* ── Pedestal with placard below main frame ── */}
      <mesh position={[0, 0.4, -3.6]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 0.4]} />
        <meshStandardMaterial color="#1a1814" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* ── Particle glow ── */}
      <pointLight position={[0, 3.5, -2]} intensity={0.3} color="#f5d98a" distance={6} decay={2} />

      <Environment preset="night" />
      <fog attach="fog" args={["#09080700", 8, 20]} />
    </group>
  );
}
