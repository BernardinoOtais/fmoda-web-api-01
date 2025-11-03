import { transformaPedidoEmJson } from "@repo/pdf";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const transformaPedidoEmJsonRecebido = await transformaPedidoEmJson(buffer);

    if (typeof transformaPedidoEmJsonRecebido === "string")
      return NextResponse.json(
        { error: transformaPedidoEmJsonRecebido },
        { status: 400 }
      );
    return NextResponse.json({
      encomenda: transformaPedidoEmJsonRecebido,
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
