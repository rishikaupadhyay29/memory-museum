"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMuseumStore } from "@/store/museumStore";

// ── Floating Dust Motes ──────────────────────────────────────────────────────

function DustMotes({ count = 400 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const qualitySettings = useMuseumStore((s) => s.qualitySettings);
  const particleCount = Math.min(count, qualitySettings.particleCount);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      speeds[i] = 0.1 + Math.random() * 0.3;
    }
    return { positions, speeds };
  }, [particleCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < particleCount; i++) {
      const x = (positions[i * 3 + 0] ?? 0) + Math.sin(t * (speeds[i] ?? 0.2) + i) * 0.3;
      const y = ((positions[i * 3 + 1] ?? 0) + t * (speeds[i] ?? 0.2) * 0.04) % 12;
      const z = (positions[i * 3 + 2] ?? 0) + Math.cos(t * (speeds[i] ?? 0.2) + i) * 0.3;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.008 + Math.random() * 0.006);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#f5d98a" transparent opacity={0.35} />
    </instancedMesh>
  );
}

// ── Architectural Column ─────────────────────────────────────────────────────

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Shaft */}
      <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 7, 12]} />
        <meshStandardMaterial color="#1a1814" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Capital */}
      <mesh castShadow position={[0, 7.2, 0]}>
        <boxGeometry args={[0.85, 0.35, 0.85]} />
        <meshStandardMaterial color="#c9a04d" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Base */}
      <mesh receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[0.75, 0.3, 0.75]} />
        <meshStandardMaterial color="#c9a04d" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

// ── Arch ─────────────────────────────────────────────────────────────────────

function Archway({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Left pillar */}
      <mesh castShadow receiveShadow position={[-2.2, 3, 0]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color="#1a1814" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Right pillar */}
      <mesh castShadow receiveShadow position={[2.2, 3, 0]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color="#1a1814" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Lintel */}
      <mesh castShadow position={[0, 6.3, 0]}>
        <boxGeometry args={[5.2, 0.6, 0.55]} />
        <meshStandardMaterial color="#c9a04d" roughness={0.4} metalness={0.65} />
      </mesh>
    </group>
  );
}

// ── Main Lobby Scene ─────────────────────────────────────────────────────────

export function LobbyScene() {
  const columnPositions: [number, number, number][] = [
    [-6, 0, -4], [6, 0, -4],
    [-6, 0, 4],  [6, 0, 4],
    [-6, 0, -12],[6, 0, -12],
  ];

  return (
    <group>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.15} color="#c9a04d" />

      {/* Key light from high above — warm gold */}
      <directionalLight
        position={[0, 18, -5]}
        intensity={1.2}
        color="#e6c878"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Side fill — cooler */}
      <pointLight position={[-10, 8, 0]} intensity={0.4} color="#9c8a6d" />
      <pointLight position={[10, 8, 0]}  intensity={0.4} color="#9c8a6d" />

      {/* Archway glow lights */}
      <pointLight position={[0, 5, -14]} intensity={0.8} color="#e6c878" distance={12} decay={2} />

      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[40, 60]} />
        <MeshReflectorMaterial
          mirror={0.4}
          blur={[300, 100]}
          resolution={512}
          color="#0d0b09"
          roughness={0.6}
          metalness={0.1}
          mixBlur={12}
          mixStrength={1.5}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
        />
      </mesh>

      {/* ── Ceiling ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[40, 60]} />
        <meshStandardMaterial color="#0d0b09" roughness={0.9} metalness={0} />
      </mesh>

      {/* ── Walls ── */}
      {/* Back wall */}
      <mesh position={[0, 5, -20]} receiveShadow>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial color="#111009" roughness={0.85} />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-14, 5, 0]} receiveShadow>
        <planeGeometry args={[60, 10]} />
        <meshStandardMaterial color="#111009" roughness={0.85} />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[14, 5, 0]} receiveShadow>
        <planeGeometry args={[60, 10]} />
        <meshStandardMaterial color="#111009" roughness={0.85} />
      </mesh>

      {/* ── Columns ── */}
      {columnPositions.map((pos, i) => (
        <Column key={i} position={pos} />
      ))}

      {/* ── Archway to first wing ── */}
      <Archway position={[0, 0, -14]} />

      {/* ── Central pedestal / focal point ── */}
      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1, 1.5]} />
          <meshStandardMaterial color="#1a1814" roughness={0.3} metalness={0.4} />
        </mesh>
        <pointLight position={[0, 2, 0]} intensity={0.6} color="#f5d98a" distance={6} decay={2} />
      </group>

      {/* ── Atmospheric particles ── */}
      <DustMotes count={500} />

      {/* ── Environment map for reflections ── */}
      <Environment preset="night" />

      {/* ── Fog ── */}
      <fog attach="fog" args={["#0a0908", 18, 45]} />
    </group>
  );
}
