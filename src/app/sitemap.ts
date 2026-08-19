import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";

const SITE_URL = "https://ogpimggen.kkweb.io";

/**
 * next-sitemap は動的セグメントを列挙できず、[locale] しか無いこのサイトでは
 * manifest とアイコンしか書き出せていなかった。ロケールは routing が持っている
 * ので自前で並べる。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date(),
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    url: locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
  }));
}
