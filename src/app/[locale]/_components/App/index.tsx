"use client";
import clsx from "clsx";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Noto_Sans_JP } from "next/font/google";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./style.module.css";

const KonvaCanvas = dynamic(async () => import("../KonvaCanvas"), {
  ssr: false,
});
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
});

export default function App(): React.JSX.Element {
  const t = useTranslations("App");
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const onDrop = useCallback(([acceptedFile]: File[]) => {
    setImageUrl(URL.createObjectURL(acceptedFile));
  }, []);
  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    multiple: false,
    onDrop,
  });
  const [faviconShape, setFaviconShape] = useState<
    "circle" | "round" | "square"
  >("square");
  const [iconShape, setIconShape] = useState<"circle" | "round" | "square">(
    "square",
  );
  const [appleIconShape, setAppleIconShape] = useState<
    "circle" | "round" | "square"
  >("square");
  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;

    const zip = new JSZip();
    const sizes = [
      { ext: "ico", name: "favicon", shape: faviconShape, size: 256 },
      {
        ext: "png",
        name: "icon-192x192",
        shape: iconShape,
        size: 192,
      },
      { ext: "png", name: "icon-512x512", shape: iconShape, size: 512 },
      { ext: "png", name: "apple-icon", shape: appleIconShape, size: 180 },
    ];

    for (const { ext, name, shape, size } of sizes) {
      const canvas = document.createElement("canvas");

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) continue;

      const img = new Image();

      img.src = imageUrl;
      await new Promise((resolve) => (img.onload = resolve));

      ctx.clearRect(0, 0, size, size);

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

      ctx.clip();

      const aspectRatio = img.width / img.height;
      const targetAspectRatio = 1;

      let sx = 0;
      let sy = 0;
      let sWidth = img.width;
      let sHeight = img.height;

      if (aspectRatio > targetAspectRatio) {
        // Image is wider than square - crop the sides
        const newWidth = img.height * targetAspectRatio;

        sx = (img.width - newWidth) / 2;
        sWidth = newWidth;
      } else if (aspectRatio < targetAspectRatio) {
        // Image is taller than square - crop the top and bottom
        const newHeight = img.width / targetAspectRatio;

        sy = (img.height - newHeight) / 2;
        sHeight = newHeight;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);
      ctx.closePath();

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => b && resolve(b), `image/${ext}`),
      );

      zip.file(`${name}.${ext}`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });

    saveAs(content, "icons.zip");
  }, [appleIconShape, faviconShape, iconShape, imageUrl]);

  return (
    <div className={styles.container}>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        <p className={styles.dropzoneText}>{t("dropzone")}</p>
      </div>
      {imageUrl ? (
        <>
          <section className={styles.section}>
            <h2 className={styles.h2}>{t("result")}</h2>
            <dl>
              <div className={styles.item}>
                <dt className={styles.term}>
                  <h3 className={styles.h3}>{t("preview")}</h3>
                </dt>
                <dd className={styles.description}>
                  <div className={styles.canvasListContainer}>
                    <KonvaCanvas src={imageUrl} />
                    <KonvaCanvas shape="round" src={imageUrl} />
                    <KonvaCanvas shape="circle" src={imageUrl} />
                  </div>
                </dd>
              </div>
              <div className={styles.item}>
                <dt className={styles.term}>
                  <h3 className={styles.h3}>favicon</h3>
                </dt>
                <dd className={styles.description}>
                  <select
                    onChange={(e) =>
                      setFaviconShape(
                        e.target.value as "circle" | "round" | "square",
                      )
                    }
                    className={styles.select}
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
                </dt>
                <dd className={styles.description}>
                  <select
                    onChange={(e) =>
                      setIconShape(
                        e.target.value as "circle" | "round" | "square",
                      )
                    }
                    className={styles.select}
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
                </dt>
                <dd className={styles.description}>
                  <select
                    onChange={(e) =>
                      setAppleIconShape(
                        e.target.value as "circle" | "round" | "square",
                      )
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
        </>
      ) : null}
    </div>
  );
}
