import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.69", "10.181.52.183"],
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
