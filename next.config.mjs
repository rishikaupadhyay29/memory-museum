/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|hdr|ktx2)$/,
      type: "asset/resource",
    });

    return config;
  },

  experimental: {
    optimizePackageImports: ["@react-three/drei", "lucide-react"],
  },
};

export default nextConfig;
