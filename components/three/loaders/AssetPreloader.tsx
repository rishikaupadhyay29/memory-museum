"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

/**
 * Configures all heavy decoder libs once in the R3F context.
 * Place this as a direct child of <Canvas> so it has access to `useThree`.
 */
export function AssetPreloader() {
  const { gl } = useThree();

  useEffect(() => {
    // KTX2 compressed texture support.
    const ktx2Loader = new KTX2Loader()
      .setTranscoderPath("/libs/basis/")
      .detectSupport(gl);

    // Draco geometry compression support.
    const dracoLoader = new DRACOLoader().setDecoderPath("/libs/draco/");

    // Patch the default GLTF loader used by useGLTF (drei).
    const gltfLoader = new GLTFLoader();
    gltfLoader.setKTX2Loader(ktx2Loader);
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);

    return () => {
      ktx2Loader.dispose();
      dracoLoader.dispose();
    };
  }, [gl]);

  return null;
}
