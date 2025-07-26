export type Foto = { fotoString: string; contentType: string };

export const SUPPORTED_EXTENSIONS = new Set([
  "png",
  "gif",
  "bmp",
  "jpeg",
  "jpg",
  "webp",
]);

export const ContentTypeMapping: { [key: string]: string } = {
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  webp: "image/webp",
};
