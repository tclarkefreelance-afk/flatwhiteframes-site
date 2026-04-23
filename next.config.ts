import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Sanity Studio's dependencies (styled-components, @sanity/ui) need transpilation
  transpilePackages: ["@sanity/ui", "sanity", "styled-components"],
};

export default nextConfig;
