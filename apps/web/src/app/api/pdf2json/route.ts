import { getSessionFromRequestValidaPapeis } from "@repo/authweb/session";
import { transformaPedidoEmJson } from "@repo/pdf";
import { PAPEL_ROTA_ADMINISTRADOR } from "@repo/tipos/consts";
import { NextResponse } from "next/server";

/**
 * Handle POST requests that convert an uploaded PDF file to JSON for administrator users.
 *
 * Expects a multipart/form-data request with a `file` field (the PDF). Requires an authenticated
 * session carrying the administrator route role; unauthorized requests are rejected before processing.
 *
 * @param request - Incoming HTTP request whose form data must include a `file` (PDF) to convert
 * @returns A JSON HTTP response:
 *          - On success: an object with `encomenda` containing the parsed JSON representation of the PDF.
 *          - On client error (missing file or invalid PDF content): `{ error: string }` with status 400.
 *          - On server error: `{ error: string }` with status 500.
 */
export async function POST(request: Request) {
  try {
    const papeis = [PAPEL_ROTA_ADMINISTRADOR];
    await getSessionFromRequestValidaPapeis(request, papeis);
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