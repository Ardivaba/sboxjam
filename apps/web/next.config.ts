import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NEXT_BUILD_DIR ? { distDir: process.env.NEXT_BUILD_DIR } : {}),
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "https", hostname: "admin.sboxjam.com" },
    ],
  },
};

export default nextConfig;
