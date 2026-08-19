/* eslint-disable filenames/match-exported, filenames/match-regex */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "OGP Image Generator";

export const size = { height: 630, width: 1200 };

export const contentType = "image/png";

const TITLE = "OGP Image Generator";
const DESCRIPTION = "Make social preview images in your browser.";

export default async function Image(): Promise<ImageResponse> {
  // satori は外部 URL を読みに行かないので、背景はデータ URI にして渡す。
  const background = await readFile(
    join(process.cwd(), "src/app/[locale]/opengraph-background.png"),
  );
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
            {DESCRIPTION}
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
    size,
  );
}
