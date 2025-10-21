// ✅ Use dynamic import for pdf2json (works in ESM / Next.js)
import { PdfReader } from "pdfreader";

export interface PdfCell {
  page: number;
  x: number;
  y: number;
  text: string;
}

export interface Pdf2JsonText {
  x: number;
  y: number;
  w: number;
  sw: number;
  A: string;
  R: { T: string }[];
}

export interface Pdf2JsonPage {
  Texts: Pdf2JsonText[];
  Width?: number;
  Height?: number;
}

export interface Pdf2JsonData {
  Pages: Pdf2JsonPage[];
  Meta?: Record<string, any>;
  Width?: number;
  Height?: number;
}

/**
 * Parse PDF buffer using pdfreader (first page only)
 */
export async function parsePdfFirstPage(buffer: Buffer): Promise<PdfCell[]> {
  const reader = new PdfReader();
  const items: PdfCell[] = [];
  let stop = false;

  await new Promise<void>((resolve, reject) => {
    reader.parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item)
        resolve(); // end of file
      else if (stop) return;
      else if ("page" in item) {
        if (item.page === 2) stop = true; // stop after first page
      } else if (item.text) {
        items.push(item as PdfCell);
      }
    });
  });

  return items;
}

/**
 * Parse PDF buffer using pdf2json (first page only)
 */
export async function parsePdf2JsonFirstPage(
  buffer: Buffer
): Promise<Pdf2JsonText[]> {
  // ✅ dynamic import to avoid ESM/CJS conflict
  const { default: PDFParser } = await import("pdf2json");
  const pdfParser = new PDFParser();

  const pdfData = await new Promise<Pdf2JsonData>((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(errData.parserError)
    );
    pdfParser.on("pdfParser_dataReady", (pdfData: any) =>
      resolve(pdfData as Pdf2JsonData)
    );
    pdfParser.parseBuffer(buffer);
  });

  const firstPage = pdfData.Pages?.[0];
  return firstPage?.Texts ?? [];
}

export async function parsePdf2Json(buffer: Buffer): Promise<Pdf2JsonText[]> {
  // Dynamic import to avoid ESM/CJS conflicts
  const { default: PDFParser } = await import("pdf2json");
  const pdfParser: InstanceType<typeof PDFParser> = new PDFParser();

  const pdfData: Pdf2JsonData = await new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: unknown) => {
      if (
        typeof errData === "object" &&
        errData !== null &&
        "parserError" in errData
      ) {
        reject((errData as { parserError: Error }).parserError);
      } else {
        reject(new Error("Unknown PDF parsing error"));
      }
    });

    pdfParser.on("pdfParser_dataReady", (data: unknown) => {
      if (
        typeof data === "object" &&
        data !== null &&
        "Pages" in data &&
        Array.isArray((data as Pdf2JsonData).Pages)
      ) {
        resolve(data as Pdf2JsonData);
      } else {
        reject(new Error("Invalid PDF data structure"));
      }
    });

    pdfParser.parseBuffer(buffer);
  });

  // Flatten all pages' texts into one array

  const resultado = pdfData.Pages.flatMap((page) => page.Texts ?? []);

  return resultado;
}

/**
 * Group text elements by approximate Y position (rows)
 */
export function groupByRows(items: PdfCell[]): string[][] {
  const grouped: Record<number, PdfCell[]> = {};

  items.forEach((item) => {
    const y = Math.round(item.y);
    if (!grouped[y]) grouped[y] = [];
    grouped[y].push(item);
  });

  return Object.values(grouped)
    .map((row) =>
      row
        .sort((a, b) => a.x - b.x)
        .map((cell) => cell.text.trim())
        .filter(Boolean)
    )
    .filter((row) => row.length > 0);
}

/**
 * Combine pdfreader + grouping to get table-like rows from first page
 */
export async function extractPdfTableFirstPage(
  buffer: Buffer
): Promise<string[][]> {
  const items = await parsePdfFirstPage(buffer);
  return groupByRows(items);
}
