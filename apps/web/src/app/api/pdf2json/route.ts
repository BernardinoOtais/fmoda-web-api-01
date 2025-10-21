import { parsePdf2Json, parsePdf2JsonFirstPage, Pdf2JsonText } from "@repo/pdf";
import { NextResponse } from "next/server";

interface SizeCell {
  order: number;
  size: string;
}

interface QuantityCell {
  order: number;
  qtt: string;
}

interface ColorRow {
  color: string;
  quantidade: QuantityCell[];
  rowTotal: string;
}

interface TotalRow {
  order: number;
  qtt: string;
}

interface PdfTableResult {
  sizes: SizeCell[];
  detaile: ColorRow[];
  total?: (TotalRow | { grandTotal: string })[];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const texts: Pdf2JsonText[] = await parsePdf2Json(buffer);

    //console.log("Original : ", texts);

    // Decode text
    const decoded = texts.map((t) => ({
      x: t.x,
      y: t.y,
      text: decodeURIComponent(t.R.map((r) => r.T ?? "").join(" ")),
    }));

    console.log("decoded : ", decoded);

    // Group by approximate Y position
    const rowsMap: Record<number, typeof decoded> = {};
    decoded.forEach((item) => {
      const yKey = Math.round(item.y);
      if (!rowsMap[yKey]) rowsMap[yKey] = [];
      rowsMap[yKey].push(item);
    });

    //console.log("rowsMap : ", rowsMap);
    const rows = Object.values(rowsMap)
      .map((row) => row.sort((a, b) => a.x - b.x))
      .filter((row) => row.length > 0);

    //console.log("Todas as linhas : ", rows);

    // --- Header row with sizes ---
    const headerRow = rows.find(
      (row) =>
        row.some((c) => c.text.toUpperCase() === "COLOR") &&
        row.some((c) => c.text.toUpperCase() === "TOTAL")
    );

    if (!headerRow) {
      return NextResponse.json(
        { error: "Header row with COLOR and TOTAL not found" },
        { status: 400 }
      );
    }

    const colorIdx = headerRow.findIndex(
      (c) => c.text.toUpperCase() === "TOTAL PEDIDO"
    );
    const totalIdx = headerRow.findIndex(
      (c) => c.text.toUpperCase() === "TOTAL PEDIDO"
    );

    const sizes: SizeCell[] = headerRow
      .slice(colorIdx + 1, totalIdx)
      .filter((c) => c?.text)
      .map((c, idx) => ({ order: idx + 1, size: c.text.trim() }));

    // Helper to parse numbers with dot as thousands separator
    const parseNumber = (str: string) => Number(str.replace(/\./g, "")) || 0;

    // --- Extract color rows and stop at TOTAL row ---
    const detaile: ColorRow[] = [];
    let totalRow: string[] | null = null;

    const dataRows = rows.slice(rows.indexOf(headerRow) + 1);

    //console.log("As tais linas", dataRows);

    for (const row of dataRows) {
      if (!row || row.length === 0) continue;

      const firstCell = row[0]?.text?.trim()?.toUpperCase();
      if (!firstCell) continue;

      if (firstCell === "TOTAL") {
        totalRow = row.map((c) => c.text.trim());
        break; // stop processing color rows
      }

      const color = row[0]?.text?.trim();
      if (!color) continue;

      const quantities: QuantityCell[] = row
        .slice(1, totalIdx)
        .map((c, idx) => ({ order: idx + 1, qtt: c?.text.trim() || "0" }));

      const rowTotal = quantities
        .map((q) => parseNumber(q.qtt))
        .reduce((acc, val) => acc + val, 0)
        .toString();

      detaile.push({ color, quantidade: quantities, rowTotal });
    }

    // --- Compute total per size ---
    const total: TotalRow[] = sizes.map((s, idx) => {
      const sum = detaile
        .map((d) => parseNumber(d.quantidade[idx]?.qtt || "0"))
        .reduce((acc, val) => acc + val, 0);
      return { order: s.order, qtt: sum.toString() };
    });

    // --- Compute grand total ---
    const grandTotalValue = totalRow?.[totalIdx]
      ? parseNumber(totalRow[totalIdx])
      : total.map((t) => parseNumber(t.qtt)).reduce((acc, val) => acc + val, 0);

    const totalWithGrand: (TotalRow | { grandTotal: string })[] = [
      ...total,
      { grandTotal: grandTotalValue.toString() },
    ];

    const result: PdfTableResult = { sizes, detaile, total: totalWithGrand };

    return NextResponse.json(result);
  } catch (error) {
    console.error("PDF2JSON parse error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to parse PDF (unknown error)";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/*



  '29': [ { x: 16.516, y: 28.556, text: 'TOTAL PEDIDO' } ],
  '30': [
    { x: 4.556, y: 30.119, text: 'COLOR' },
    { x: 11.676, y: 30.119, text: 'S' },
    { x: 18.189, y: 30.119, text: 'M' },
    { x: 24.796, y: 30.119, text: 'L' },
    { x: 30.828, y: 30.119, text: 'TOTAL' }
  ],
  '32': [
    { x: 2.25, y: 31.587000000000003, text: '712 - CRUDO' },
    { x: 13.672, y: 31.587000000000003, text: '9.813' },
    { x: 20.006, y: 31.587000000000003, text: '10.156' },
    { x: 26.797, y: 31.587000000000003, text: '7.579' },
    { x: 33.131, y: 31.587000000000003, text: '27.548' }
  ],
  '33': [
    { x: 2.25, y: 33.462, text: '807 - GRIS ANTR' },
    { x: 13.672, y: 33.462, text: '7.850' },
    { x: 20.006, y: 33.462, text: '10.814' },
    { x: 26.797, y: 33.462, text: '7.526' },
    { x: 33.131, y: 33.462, text: '26.190' }
  ],
  '35': [
    { x: 4.578, y: 35.119, text: 'TOTAL' },
    { x: 13.443, y: 35.025, text: '17.663' },
    { x: 20.006, y: 35.025, text: '20.970' },
    { x: 26.568, y: 35.025, text: '15.105' },
    { x: 33.131, y: 35.025, text: '53.738' }
  ],
  '36': [
    { x: 2.25, y: 36.494, text: 'UNID. LOT.' },
    { x: 4.425, y: 36.494, text: '     ' },
    { x: 5.083, y: 36.494, text: '2' }

*/
