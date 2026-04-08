import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Optional: Configure minimum cache TTL (default is 4 hours)
    minimumCacheTTL: 14400,
  },
};

export default nextConfig;
