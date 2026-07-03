"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useMuseumStore } from "@/store/museumStore";
import { lerp } from "@/lib/utils";

const LOBBY_DEFAULT_POSITION = new THREE.Vector3(0, 1.7, 8);
const LOBBY_DEFAULT_LOOK = new THREE.Vector3(0, 1, 0);

export function CameraRig() {
  const { camera } = useThree();
  const cameraMode = useMuseumStore((s) => s.cameraMode);
  const cameraTarget = useMuseumStore((s) => s.cameraTarget);
  const isTransitioning = useMuseumStore((s) => s.isTransitioning);
  const setTransitioning = useMuseumStore((s) => s.setTransitioning);
  const setFrameloop = useMuseumStore((s) => s.setFrameloop);

  const targetPos = useRef(new THREE.Vector3().copy(LOBBY_DEFAULT_POSITION));
  const targetLook = useRef(new THREE.Vector3().copy(LOBBY_DEFAULT_LOOK));
  const currentLook = useRef(new THREE.Vector3().copy(LOBBY_DEFAULT_LOOK));
  const isAnimating = useRef(false);

  // Initialise camera at lobby position.
  useEffect(() => {
    camera.position.copy(LOBBY_DEFAULT_POSITION);
    camera.lookAt(LOBBY_DEFAULT_LOOK);
  }, [camera]);

  // Animate camera to a new target whenever museumStore.cameraTarget changes.
  useEffect(() => {
    if (!cameraTarget) return;

    const dest = new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    const look = new THREE.Vector3(
      cameraTarget.lookAtX,
      cameraTarget.lookAtY,
      cameraTarget.lookAtZ
    );

    targetPos.current.copy(dest);
    targetLook.current.copy(look);
    isAnimating.current = true;
    setFrameloop("always");

    const timeline = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setTransitioning(false);
        setFrameloop("demand");
      },
    });

    timeline.to(camera.position, {
      x: dest.x,
      y: dest.y,
      z: dest.z,
      duration: 2.2,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(currentLook.current);
      },
    });

    // Simultaneously animate the look-at target.
    timeline.to(
      currentLook.current,
      {
        x: look.x,
        y: look.y,
        z: look.z,
        duration: 2.2,
        ease: "power3.inOut",
      },
      "<"
    );
  }, [cameraTarget, camera, setTransitioning, setFrameloop]);

  // Smooth interpolation of look target during free movement.
  useFrame(() => {
    if (!isAnimating.current && !isTransitioning) {
      currentLook.current.lerp(targetLook.current, 0.05);
      camera.lookAt(currentLook.current);
    }
  });

  if (cameraMode === "orbit") {
    return (
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.1}
        maxDistance={20}
        minDistance={2}
        enableDamping
        dampingFactor={0.05}
      />
    );
  }

  return null; // First-person: mouse movement handled at HUD/DOM level in later phase.
}
