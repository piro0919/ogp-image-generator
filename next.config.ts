// eslint-disable-next-line filenames/match-regex
import withSerwistInit from "@serwist/next";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  disable: process.env.NODE_ENV === "development",
  swDest: "public/sw.js",
  // eslint-disable-next-line write-good-comments/write-good-comments
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
});
const nextConfig: NextConfig = withSerwist({
  /* config options here */
  experimental: {
    typedEnv: true,
    // typedRoutes: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    return config;
  },
});
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
