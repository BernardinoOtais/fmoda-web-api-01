import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const saveBase64Image = async (base64: string, filename: string) => {
  const buffer = Buffer.from(base64, "base64");
  const filePath = path.join(UPLOAD_DIR, filename);

  await fs.promises.writeFile(filePath, buffer);

  return { filePath };
};
