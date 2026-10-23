import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Personal pages (your results and history) and sign-in are never indexed.
  async headers() {
    return ["/results/:path*", "/history/:path*", "/sign-in/:path*", "/sign-up/:path*", "/auth/:path*", "/api/:path*"].map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
};

export default nextConfig;
