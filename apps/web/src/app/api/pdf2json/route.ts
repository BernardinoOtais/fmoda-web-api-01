import { getSessionFromRequestValidaPapeis } from "@repo/authweb/session";
import { transformaPedidoEmJson } from "@repo/pdf";
import { PAPEL_ROTA_ADMINISTRADOR } from "@repo/tipos/consts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let buffer: Buffer<ArrayBuffer> | null = null;
  try {
    const papeis = [PAPEL_ROTA_ADMINISTRADOR];
    await getSessionFromRequestValidaPapeis(request, papeis);
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    buffer = Buffer.from(await file.arrayBuffer());

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
  } finally {
    // Explicit cleanup
    if (buffer) {
      buffer = null;
    }
    if (global.gc) {
      global.gc();
    }
  }
}
