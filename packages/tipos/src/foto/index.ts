import z from "zod";

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

export const uploadPhotoSchema = z.object({
  base64: z.string(),
  filename: z.string(),
});

export const CenasECoisa = z.object({
  imagem: z.file(),
});
