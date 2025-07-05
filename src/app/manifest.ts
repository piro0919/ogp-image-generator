import { getTranslations } from "next-intl/server";
import type { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({ locale: "en", namespace: "Metadata" });

  return {
    background_color: "#FFFFFF",
    description: t("description"),
    display: "standalone",
    icons: [
      {
        purpose: "maskable",
        sizes: "192x192",
        src: "/icon-192x192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/icon-512x512.png",
        type: "image/png",
      },
    ],
    id: "/",
    lang: "en",
    name: "OGP Image Generator",
    orientation: "portrait",
    scope: "/",
    short_name: "OGP ImgGen",
    start_url: "/",
    theme_color: "#FFFFFF",
  };
}
