import { PdfText, Pdf2JsonText, Pdf2JsonData } from "@repo/tipos/pdf";

export async function parsePdf2Json(buffer: Buffer): Promise<Pdf2JsonText[]> {
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

export const extraiTodasEntregas = (
  data: PdfText[],
  textoInicial: string,
  textoFinal: string,
  inicio: string
): PdfText[][] => {
  const sections: PdfText[][] = [];

  // Find the first "ENTREGAS PARCIALES" section
  let currentStart = data.findIndex((t) =>
    t.text.toUpperCase().includes(inicio)
  );
  if (currentStart === -1) return [];

  // Move to the first PEDIDO after "ENTREGAS PARCIALES"
  currentStart = data.findIndex(
    (t, i) => i > currentStart && t.text.toUpperCase().includes(textoInicial)
  );

  while (currentStart !== -1) {
    // Find the end marker ("PRECIO COSTE:")
    const endIndex = data.findIndex(
      (t, i) => i > currentStart && t.text.toUpperCase().includes(textoFinal)
    );
    if (endIndex === -1) break;

    // 🔹 Include "PRECIO COSTE:" and the following text (the price)
    const nextElement = data[endIndex + 1];
    const sliceEnd = nextElement ? endIndex + 1 : endIndex;

    // Extract inclusive section
    const section = data.slice(currentStart, sliceEnd + 1);
    sections.push(section);

    // Move to the next PEDIDO after this section
    currentStart = data.findIndex(
      (t, i) => i > endIndex && t.text.toUpperCase().includes(textoInicial)
    );
  }

  return sections;
};

export const extraiPorcoesNaoInclusive = (
  data: PdfText[],
  textoInicial: string,
  textoFinal: string
): PdfText[] => {
  const startIndex = data.findIndex((t) =>
    t.text.toUpperCase().includes(textoInicial)
  );
  const endIndex = data.findIndex((t) =>
    t.text.toUpperCase().includes(textoFinal)
  );

  if (
    startIndex === -1 ||
    endIndex === -1 ||
    endIndex <= startIndex + 1 // ensure valid range
  ) {
    return [];
  }
  return data.slice(startIndex + 1, endIndex);
};

export const groupItemsByYCoordinate = <T extends { y: number }>(
  items: T[]
): Record<number, T[]> => {
  const rowsMap: Record<number, T[]> = {};

  items.forEach((item) => {
    const yKey = Math.round(item.y);
    if (!rowsMap[yKey]) {
      rowsMap[yKey] = [];
    }
    rowsMap[yKey].push(item);
  });

  return rowsMap;
};

export const trataPedidoPrincipal = (dadod: Record<number, PdfText[]>) => {
  const lines = Object.entries(dadod)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, v]) => v);

  const qttLinhas = lines.length;

  if (qttLinhas < 3) return [];

  let tamanhos: { tam: string; ordem: number }[] = [];

  const linhasPedidoCor: PdfText[][] = [];

  let total: PdfText[] = [];

  lines.forEach((l, i) => {
    if (i === 0)
      tamanhos =
        l
          ?.filter((_, i) => i !== 0 && i !== l.length - 1)
          .map((c, i) => ({ tam: c.text, ordem: i + 1 })) ?? [];

    if (i !== 0 && qttLinhas - 1 !== i) {
      linhasPedidoCor.push(l);
    }
    if (i === qttLinhas - 1) total = l;
  });

  console.log(
    "tamanhos :",
    tamanhos,
    "linhasPedidoCor: ",
    linhasPedidoCor,
    "total : ",
    total
  );
};
