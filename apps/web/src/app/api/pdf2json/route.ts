import {
  parsePdf2Json,
  extraiTodasEntregas,
  extraiPorcoesNaoInclusive,
  groupItemsByYCoordinate,
  trataPedidoPrincipal,
  extraiPorcoesInclusive,
  getValuesBeneathOptimized,
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

    const cabecalhoPedido = extraiPorcoesInclusive(
      decoded,
      "Nº PED.",
      "TOTAL PEDIDO"
    );

    const cabecalho = getValuesBeneathOptimized(cabecalhoPedido);

    if (cabecalho.dataEntrega !== null) {
      const preco = extraiPorcoesInclusive(
        decoded,
        "PRECIO COSTE:",
        "página ",
        true
      );

      console.log("dados : ", preco);
      const precoPeca = preco[1]?.text;

      if (!precoPeca)
        return NextResponse.json(
          { error: "Tem que ter preço" },
          { status: 400 }
        );
      const valorPrecoPeca = precoPeca.replace(" EUR", "");
      const precoFinal = transformaTextoEmNumero(valorPrecoPeca, "float");
      if (precoFinal === null)
        return NextResponse.json(
          { error: "Erro ao transforma preço em número" },
          { status: 400 }
        );
      console.log("O tais preco : ", precoFinal);
    }

    const pedidoPrincipal = extraiPorcoesNaoInclusive(
      decoded,
      "TOTAL PEDIDO",
      "UNID. LOT."
    );

    const entregasParciais = extraiTodasEntregas(
      decoded,
      "PEDIDO",
      "PRECIO COSTE:",
      "ENTREGAS PARCIALES"
    );

    const entregasParciaisAgrupadas = entregasParciais.map((a) =>
      groupItemsByYCoordinate(a)
    );

    const pedidoPrincipalAgrupada = groupItemsByYCoordinate(pedidoPrincipal);

    const encomenda = trataPedidoPrincipal(pedidoPrincipalAgrupada);

    return NextResponse.json({
      encomenda,
    });
  } catch (error) {
    console.error("PDF2JSON parse error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to parse PDF (unknown error)";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const transformaTextoEmNumero = (
  n?: string,
  tipo: "int" | "float" = "int"
): number | null => {
  if (!n) return null;

  const cleaned = n.replace(/\./g, "").replace(",", ".");

  const parsed = tipo === "int" ? parseInt(cleaned, 10) : parseFloat(cleaned);

  return Number.isNaN(parsed) ? null : parsed;
};
