import fs from "fs/promises";
import path from "path";

import {
  ContentTypeMapping,
  Foto,
  SUPPORTED_EXTENSIONS,
} from "@repo/tipos/foto";

export const fotoModelo = async (id: string) => {
  if (!process.env.IMAGE_PATH) return null;

  const caminho = id.trim();

  if (caminho.includes("..")) {
    console.error("Invalid image ID: contains path traversal characters");
    return null;
  }
  const imagePath = path.join(process.env.IMAGE_PATH, caminho);

  const ext = path.extname(caminho).slice(1).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    console.error(`Unsupported file extension: ${ext}`);
    return null;
  }
  try {
    const data = await fs.readFile(imagePath);

    if (!data) return null;

    const ext = path.extname(imagePath).slice(1);

    const contentType = ContentTypeMapping[ext.toLowerCase()];

    if (!contentType) {
      return null;
    }

    const encoded = Buffer.from(data).toString("base64");
    const valor: Foto = { fotoString: encoded, contentType };

    return valor;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("ENOENT")) {
        console.error(`File not found: ${caminho}`);
      } else if (error.message.includes("EACCES")) {
        console.error(`Permission denied: ${caminho}`);
      } else {
        console.error(`Error reading file ${caminho}:`, error.message);
      }
    } else {
      console.error(`Unknown error reading file ${caminho}:`, error);
    }
    return null;
  }
};
