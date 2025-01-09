import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/news',
        permanent: true, // Use `false` if this is a temporary redirect
      },
    ];
  },
};

export default nextConfig;
