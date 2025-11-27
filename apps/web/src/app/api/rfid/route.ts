import { getSessionFromRequestValidaPapeis } from "@repo/authweb/session";
import { postRfidsDb } from "@repo/db/rfid";
import { PAPEL_RFID } from "@repo/tipos/consts";
import { PostRfidFinalSchema } from "@repo/tipos/rfid";
import { NextResponse } from "next/server";

/**
 * Handle POST requests that validate the caller's RFID role, validate and persist an RFID JSON payload, and return the operation result.
 *
 * @param req - Incoming HTTP request containing the RFID payload as JSON
 * @returns JSON with `{ result }` on success, or `{ error: message }` with a 500 status on failure
 */
export async function POST(req: Request) {
  try {
    const papeis = [PAPEL_RFID];

    const bodyJson = await req.json();
    //console.log("corpo : ", bodyJson);

    await getSessionFromRequestValidaPapeis(req, papeis);

    const body = PostRfidFinalSchema.parse(bodyJson);

    const result = await postRfidsDb(body);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("PDF2JSON parse error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to parse PDF (unknown error)";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}