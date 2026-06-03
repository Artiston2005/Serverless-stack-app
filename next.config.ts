import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.36.90.30'],
  experimental: {
    turbopack: {
      root: __dirname,
    }
  }
};

export default nextConfig;
