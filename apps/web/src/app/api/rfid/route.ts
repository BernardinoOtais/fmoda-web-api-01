import { getSessionFromRequestValidaPapeis } from "@repo/authweb/session";
import { postRfidsDb } from "@repo/db/rfid";
import { PAPEL_RFID } from "@repo/tipos/consts";
import { PostRfidFinalSchema } from "@repo/tipos/rfid";
import { NextResponse } from "next/server";

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
