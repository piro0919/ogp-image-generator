import type { MetadataRoute } from "next";

const SITE_URL = "https://ogpimggen.kkweb.io";

export default function robots(): MetadataRoute.Robots {
  return {
    host: SITE_URL,
    rules: { allow: "/", userAgent: "*" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
