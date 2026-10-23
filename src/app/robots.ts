import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://psyc.6x7.gr").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/results", "/history", "/auth/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
