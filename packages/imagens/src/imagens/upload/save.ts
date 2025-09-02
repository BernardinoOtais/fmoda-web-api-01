// src/imagens/save.ts
import path from "path";

import sharp from "sharp";

export async function saveResizedImage(filePath: string, width = 800) {
  const output = path.join(
    path.dirname(filePath),
    "resized-" + path.basename(filePath)
  );

  await sharp(filePath).resize(width).toFile(output);

  return output;
}
