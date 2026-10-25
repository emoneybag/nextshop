import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Stock photography for the demo catalogue lives on Unsplash.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
