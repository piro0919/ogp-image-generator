/* eslint-disable filenames/match-exported, filenames/match-regex */
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { routing } from "@/i18n/routing";

export const alt = "OGP Image Generator";

export const size = { height: 630, width: 1200 };

export const contentType = "image/png";

/* ビルド時に焼く。動的なままだと背景とフォントが関数側に含まれず、
   本番で読めずに 500 になる */
export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

const TITLE = "OGP Image Generator";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ImageResponse> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OgImage" });
  // satori は外部 URL を読みに行かないので、背景はデータ URI にして渡す。
  const [background, regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "src/app/[locale]/opengraph-background.png")),
    readFile(join(process.cwd(), "assets/NotoSansJP-Regular-subset.ttf")),
    readFile(join(process.cwd(), "assets/NotoSansJP-Bold-subset.ttf")),
  ]);
  const backgroundSrc = `data:image/png;base64,${background.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0b0b0f",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <img
          alt=""
          height={size.height}
          src={backgroundSrc}
          style={{ left: 0, position: "absolute", top: 0 }}
          width={size.width}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            padding: "0 90px",
            width: 660,
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #c084fc 0%, #9333ea 100%)",
              borderRadius: 999,
              display: "flex",
              height: 10,
              marginBottom: 44,
              width: 120,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            {TITLE}
          </div>
          <div
            style={{
              color: "#a1a1aa",
              display: "flex",
              fontSize: 32,
              lineHeight: 1.4,
              marginTop: 28,
            }}
          >
            {t("tagline")}
          </div>
          <div
            style={{
              color: "#71717a",
              display: "flex",
              fontSize: 26,
              marginTop: 56,
            }}
          >
            kkweb.io
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // 本体と同じ Noto Sans JP。欧文も日本語も1つの書体で通る
      fonts: [
        { data: regular, name: "Noto Sans JP", style: "normal", weight: 400 },
        { data: bold, name: "Noto Sans JP", style: "normal", weight: 700 },
      ],
    },
  );
}
