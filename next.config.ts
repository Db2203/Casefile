import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We have a stray lockfile in the home dir; pin the workspace root so
  // Turbopack doesn't infer the wrong one.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
