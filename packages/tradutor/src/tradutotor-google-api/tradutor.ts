import { GoogleTranslateResponseSchema } from "@repo/tipos/tradutor";

export const tradutor = async (sl: string, tl: string, q: string) => {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.append("client", "gtx");
  url.searchParams.append("sl", sl);
  url.searchParams.append("tl", tl);
  url.searchParams.append("dt", "t");
  url.searchParams.append("q", q);

  const res = await fetch(url.toString());
  if (!res.ok) {
    return null;
  }

  const resultado = await res.json();

  const resultadoValido = GoogleTranslateResponseSchema.parse(resultado);

  return resultadoValido[0][0]?.[0];
};
