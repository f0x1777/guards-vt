import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    externalDir: true,
  },
  turbopack: {
    resolveAlias: {
      "@pitch": path.resolve(process.cwd(), "../pitch/src"),
    },
  },
};

export default nextConfig;
