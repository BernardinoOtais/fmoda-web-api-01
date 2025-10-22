import {
  parsePdf2Json,
  extraiTodasEntregas,
  extraiPorcoesNaoInclusive,
  groupItemsByYCoordinate,
} from "@repo/pdf";
import { PdfText, Pdf2JsonText } from "@repo/tipos/pdf";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const texts: Pdf2JsonText[] = await parsePdf2Json(buffer);

    const decoded: PdfText[] = texts.map((t) => ({
      x: t.x,
      y: t.y,
      text: decodeURIComponent(t.R.map((r) => r.T ?? "").join(" ")),
    }));

    const pedidoTotalRaw = extraiPorcoesNaoInclusive(
      decoded,
      "TOTAL PEDIDO",
      "UNID. LOT."
    );

    const allSections = extraiTodasEntregas(
      decoded,
      "PEDIDO",
      "PRECIO COSTE:",
      "ENTREGAS PARCIALES"
    );

    const rowsMap = allSections.map((a) => groupItemsByYCoordinate(a));
    return NextResponse.json(rowsMap);
  } catch (error) {
    console.error("PDF2JSON parse error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to parse PDF (unknown error)";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
