import { getSessionFromRequestValidaPapeis } from "@repo/authweb/session";
import {
  PAPEL_CP,
  PAPEL_ROTA_ADMINISTRADOR,
  PAPEL_ROTA_PLANEAMENTO,
} from "@repo/tipos/consts";
import httpntlm from "httpntlm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const papeis = [PAPEL_CP, PAPEL_ROTA_ADMINISTRADOR, PAPEL_ROTA_PLANEAMENTO];
    await getSessionFromRequestValidaPapeis(req, papeis);

    const { searchParams } = new URL(req.url);

    const op = searchParams.get("op") ?? "";
    const format = searchParams.get("format") ?? "PDF";
    const po = searchParams.get("po") ?? "";
    const forPlan = searchParams.get("forPlan") ?? "";

    const ssrsBase = "http://10.0.0.13/ReportServer";

    const params = new URLSearchParams({
      "rs:Command": "Render",
      "rs:Format": format === "PDF" ? "PDF" : "EXCELOPENXML",
      forPlan: forPlan,
      op: op,
      po: po,
    });

    const ssrsUrl = `${ssrsBase}?/op%20contratos%20fornecedores/planeamento&${params.toString()}`;

    console.log("url : ", ssrsUrl);
    const result = await new Promise<Buffer>((resolve, reject) => {
      httpntlm.get(
        {
          url: ssrsUrl,
          username: process.env.SSRS_USERNAME || "",
          password: process.env.SSRS_PASSWORD || "",
          workstation: process.env.SSRS_WORKSTATION || "",
          domain: process.env.SSRS_DOMAIN || "",
          binary: true,
        },
        (err: unknown, res: { statusCode: number; body: Buffer }) => {
          if (err) {
            console.error("NTLM request error:", err);
            reject(err);
            return;
          }

          if (res.statusCode !== 200) {
            console.error("SSRS error response:", {
              statusCode: res.statusCode,
              body: res.body?.toString(),
            });
            reject(
              new Error(
                `SSRS returned status ${res.statusCode}: ${res.body?.toString()}`
              )
            );
            return;
          }

          resolve(res.body);
        }
      );
    });

    let contentType: string;
    let fileName: string;

    if (format === "EXCELOPENXML") {
      contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      fileName = "contratos-fornecedores.xlsx";
    } else {
      contentType = "application/pdf";
      fileName = "contratos-fornecedores.pdf";
    }

    return new NextResponse(new Uint8Array(result), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": result.length.toString(),
      },
    });
    // ---------------------------------------------
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes("Unauthorized")
      ? 401
      : message.includes("Forbidden")
        ? 403
        : 500;

    console.error("Fetch error:", error);

    return NextResponse.json(
      {
        error: message,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status }
    );
  }
}
