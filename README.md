# OGP Image Generator

> Free tool that turns one image into a favicon and PWA icons.

Despite the name, it does not make OGP (social preview) images. Drop in one
image, pick a shape and a background colour, and download `icons.zip`.
Everything is converted in the browser, so the image is never uploaded.

[🔗 Live Site](https://ogpimggen.kkweb.io)

## ✨ Features

- 🔖 Builds four files from a single PNG, JPEG or WebP image:
  - `favicon.ico` with 16, 32 and 48px images inside
  - `icon-192x192.png` and `icon-512x512.png` for the web app manifest
  - `apple-icon.png` at 180px
- 🔷 Square, round or circle shape, chosen separately for each kind of icon
- 🎨 Background colour, or a transparent background for the favicon
- ✂️ Non-square images are cropped to a square from the centre
- 📦 Downloads everything as one ZIP

## 🛠 Tech Stack

- Next.js (App Router) + React + TypeScript
- CSS Modules
- next-intl for English and Japanese
- Canvas API for drawing, JSZip for the ZIP

## 🚀 Development

```bash
npm install
npm run dev
```

## 📄 License

MIT
