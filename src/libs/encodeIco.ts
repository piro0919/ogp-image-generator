export type IcoImage = {
  // PNG のバイト列。ICO は Windows Vista 以降、BMP の代わりに PNG をそのまま格納できる
  png: Uint8Array;
  size: number;
};

const ICONDIR_SIZE = 6;
const ICONDIRENTRY_SIZE = 16;

// 正方形の PNG を複数受け取り、ICO コンテナに詰めて返す。
// 各エントリの幅と高さは 1 バイトで、256 は 0 と書く決まり。
export default function encodeIco(images: IcoImage[]): Uint8Array<ArrayBuffer> {
  if (images.length === 0) {
    throw new Error("encodeIco needs at least one image");
  }

  for (const { size } of images) {
    if (!Number.isInteger(size) || size < 1 || size > 256) {
      throw new RangeError(`ICO image size must be 1-256, got ${size}`);
    }
  }

  const headerSize = ICONDIR_SIZE + ICONDIRENTRY_SIZE * images.length;
  const totalSize = images.reduce(
    (sum, { png }) => sum + png.byteLength,
    headerSize,
  );
  const bytes = new Uint8Array(totalSize);
  const view = new DataView(bytes.buffer);

  // ICONDIR: reserved, type (1 = icon), count
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);

  let offset = headerSize;

  images.forEach(({ png, size }, index) => {
    const entry = ICONDIR_SIZE + ICONDIRENTRY_SIZE * index;
    const dimension = size === 256 ? 0 : size;

    view.setUint8(entry, dimension);
    view.setUint8(entry + 1, dimension);
    // パレットなし、予約領域
    view.setUint8(entry + 2, 0);
    view.setUint8(entry + 3, 0);
    // カラープレーン数と 1 ピクセルあたりのビット数
    view.setUint16(entry + 4, 1, true);
    view.setUint16(entry + 6, 32, true);
    view.setUint32(entry + 8, png.byteLength, true);
    view.setUint32(entry + 12, offset, true);
    bytes.set(png, offset);
    offset += png.byteLength;
  });

  return bytes;
}
