"use client";
import NoSSR from "@mpth/react-no-ssr";
import { Sketch } from "@uiw/react-color";
import clsx from "clsx";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Noto_Sans_JP } from "next/font/google";
import { Checkbox, useCheckboxState } from "pretty-checkbox-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FcInfo } from "react-icons/fc";
import { Tooltip } from "react-tooltip";
import encodeIco from "@/libs/encodeIco";
import useImageStore from "../../useImageStore";
import styles from "./style.module.css";

const KonvaCanvas = dynamic(async () => import("../KonvaCanvas"), {
  ssr: false,
});
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
});

export type AppProps = {
  // 説明文はサーバーで描くのでここへ差し込む。ドロップ枠の上に置く
  children: React.ReactNode;
};

type Shape = "circle" | "round" | "square";

const FAVICON_SIZES = [16, 32, 48];

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = (): void => resolve(img);
    img.onerror = (): void => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

async function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);

        return;
      }

      reject(new Error("canvas.toBlob returned null"));
    }, "image/png");
  });
}

// 中央で正方形に切り抜いた画像を、指定の形でくり抜いて描く。
// background が null なら背景は透過のまま残す
function drawIcon(
  img: HTMLImageElement,
  size: number,
  shape: Shape,
  background: null | string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("2D canvas context is unavailable");

  ctx.beginPath();

  switch (shape) {
    case "circle": {
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);

      break;
    }
    case "round": {
      const radius = size * 0.2;

      ctx.moveTo(radius, 0);
      ctx.arcTo(size, 0, size, radius, radius);
      ctx.arcTo(size, size, size - radius, size, radius);
      ctx.arcTo(0, size, 0, size - radius, radius);
      ctx.arcTo(0, 0, radius, 0, radius);

      break;
    }
    case "square": {
      ctx.rect(0, 0, size, size);

      break;
    }
  }

  if (background !== null) {
    ctx.fillStyle = background;
    ctx.fill();
  }

  ctx.clip();

  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2;
  const sy = (img.height - side) / 2;

  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
  ctx.closePath();

  return canvas;
}

export default function App({ children }: AppProps): React.JSX.Element {
  const t = useTranslations("App");
  const { imageUrl, setImageUrl } = useImageStore();
  const [error, setError] = useState<null | string>(null);
  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) {
        setError(t("error.unsupported"));

        return;
      }

      const url = URL.createObjectURL(file);

      try {
        await loadImage(url);
      } catch {
        URL.revokeObjectURL(url);
        setError(t("error.load"));

        return;
      }

      // 差し替える前の URL はもう誰も使わないので解放する
      if (imageUrl) URL.revokeObjectURL(imageUrl);

      setImageUrl(url);
      setError(null);
    },
    [imageUrl, setImageUrl, t],
  );
  const onDrop = useCallback(
    ([acceptedFile]: File[]) => {
      void handleFile(acceptedFile);
    },
    [handleFile],
  );
  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    multiple: false,
    onDrop,
  });
  const [faviconShape, setFaviconShape] = useState<Shape>("square");
  const [iconShape, setIconShape] = useState<Shape>("square");
  const [appleIconShape, setAppleIconShape] = useState<Shape>("square");
  const [hex, setHex] = useState("#2196f3");
  const checkbox = useCheckboxState();
  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;

    try {
      const img = await loadImage(imageUrl);
      const zip = new JSZip();
      const faviconBackground = checkbox.state ? null : hex;
      const faviconImages = await Promise.all(
        FAVICON_SIZES.map(async (size) => {
          const blob = await canvasToPng(
            drawIcon(img, size, faviconShape, faviconBackground),
          );

          return { png: new Uint8Array(await blob.arrayBuffer()), size };
        }),
      );

      zip.file("favicon.ico", encodeIco(faviconImages));

      const pngs = [
        { name: "icon-192x192", shape: iconShape, size: 192 },
        { name: "icon-512x512", shape: iconShape, size: 512 },
        { name: "apple-icon", shape: appleIconShape, size: 180 },
      ];

      for (const { name, shape, size } of pngs) {
        zip.file(
          `${name}.png`,
          await canvasToPng(drawIcon(img, size, shape, hex)),
        );
      }

      const content = await zip.generateAsync({ type: "blob" });

      saveAs(content, "icons.zip");
      setError(null);
    } catch {
      setError(t("error.generate"));
    }
  }, [
    appleIconShape,
    checkbox.state,
    faviconShape,
    hex,
    iconShape,
    imageUrl,
    t,
  ]);

  return (
    <>
      <div className={styles.container}>
        {children}
        <div {...getRootProps()} className={styles.dropzone}>
          <input aria-label={t("fileInput")} {...getInputProps()} />
          <p className={styles.dropzoneText}>{t("dropzone")}</p>
        </div>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        {imageUrl ? (
          <NoSSR>
            <section className={styles.section}>
              <h2 className={styles.h2}>{t("result")}</h2>
              <dl>
                <div className={styles.item}>
                  <dt className={styles.term}>
                    <h3 className={styles.h3}>{t("preview")}</h3>
                  </dt>
                  <dd className={styles.description}>
                    <div className={styles.canvasListContainer}>
                      <KonvaCanvas backgroundColor={hex} src={imageUrl} />
                      <KonvaCanvas
                        backgroundColor={hex}
                        shape="round"
                        src={imageUrl}
                      />
                      <KonvaCanvas
                        backgroundColor={hex}
                        shape="circle"
                        src={imageUrl}
                      />
                    </div>
                  </dd>
                </div>
                <div className={styles.item}>
                  <dt className={styles.term}>
                    <h3 className={styles.h3}>{t("background")}</h3>
                    <a
                      data-tooltip-content={t("tooltip.background")}
                      data-tooltip-id="my-tooltip"
                    >
                      <FcInfo size={12} />
                    </a>
                  </dt>
                  <dd className={styles.description}>
                    <Sketch
                      color={hex}
                      disableAlpha={true}
                      onChange={(color) => setHex(color.hex)}
                    />
                  </dd>
                </div>
                <div className={styles.item}>
                  <dt className={styles.term}>
                    <h3 className={styles.h3}>favicon</h3>
                  </dt>
                  <dd className={styles.description}>
                    <Checkbox
                      className={styles.checkbox}
                      onChange={checkbox.onChange}
                      setState={(value) => checkbox.setState(!!value)}
                      state={checkbox.state}
                    >
                      {t("transparent")}
                    </Checkbox>
                    <select
                      className={styles.select}
                      onChange={(e) => setFaviconShape(e.target.value as Shape)}
                      value={faviconShape}
                    >
                      <option value="square">{t("shapes.square")}</option>
                      <option value="round">{t("shapes.round")}</option>
                      <option value="circle">{t("shapes.circle")}</option>
                    </select>
                  </dd>
                </div>
                <div className={styles.item}>
                  <dt className={styles.term}>
                    <h3 className={styles.h3}>icon</h3>
                    <a
                      data-tooltip-content={t("tooltip.icon")}
                      data-tooltip-id="my-tooltip"
                    >
                      <FcInfo size={12} />
                    </a>
                  </dt>
                  <dd className={styles.description}>
                    <select
                      className={styles.select}
                      onChange={(e) => setIconShape(e.target.value as Shape)}
                      value={iconShape}
                    >
                      <option value="square">{t("shapes.square")}</option>
                      <option value="round">{t("shapes.round")}</option>
                      <option value="circle">{t("shapes.circle")}</option>
                    </select>
                  </dd>
                </div>
                <div className={styles.item}>
                  <dt className={styles.term}>
                    <h3 className={styles.h3}>apple-icon</h3>
                    <a
                      data-tooltip-content={t("tooltip.appleIcon")}
                      data-tooltip-id="my-tooltip"
                    >
                      <FcInfo size={12} />
                    </a>
                  </dt>
                  <dd className={styles.description}>
                    <select
                      onChange={(e) =>
                        setAppleIconShape(e.target.value as Shape)
                      }
                      className={styles.select}
                      value={appleIconShape}
                    >
                      <option value="square">{t("shapes.square")}</option>
                      <option value="round">{t("shapes.round")}</option>
                      <option value="circle">{t("shapes.circle")}</option>
                    </select>
                  </dd>
                </div>
              </dl>
            </section>
            <div className={styles.buttonContainer}>
              <button
                className={clsx(styles.button, notoSansJP.className)}
                onClick={() => void handleDownload()}
              >
                {t("download")}
              </button>
            </div>
          </NoSSR>
        ) : null}
      </div>
      <Tooltip className={styles.tooltip} id="my-tooltip" />
    </>
  );
}
