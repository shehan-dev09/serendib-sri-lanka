import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure binary map assets in /public/terrain are always requestable.
  async headers() {
    return [
      {
        source: "/terrain/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
