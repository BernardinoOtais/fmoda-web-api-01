import fs from "fs";
import path from "path";

import QRCode from "qrcode";
import sharp from "sharp";

export const escreveQrcode = async (dados: string, nome: string) => {
  if (!process.env.IMAGE_PATH) return null;
  const projectRoot = process.env.IMAGE_PATH;
  const currentYear = new Date().getFullYear();
  const yearString = currentYear.toString();
  const destino = path.join(projectRoot, "qrcode/", yearString, "/");

  await fs.promises.mkdir(destino, { recursive: true });

  const ficheiro = path.join(destino, nome + ".jpg");

  //crio o ficheiro
  const pngBuffer = await QRCode.toBuffer(dados, {
    scale: 2,
    errorCorrectionLevel: "M",
    margin: 2,
    version: 9,
  });

  //de png para jpg
  await sharp(pngBuffer).threshold(128).jpeg().toFile(ficheiro);

  const valorARetornar = yearString + "/" + nome + ".jpg";

  return valorARetornar;
};
