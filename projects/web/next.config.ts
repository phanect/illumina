import type { NextConfig } from "next";

if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error("NEXT_PUBLIC_URL environment variable is not set.");
}

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    process.env.NEXT_PUBLIC_URL,
  ],
};

export default nextConfig;
