import z from "zod";

export const GoogleTranslateResponseSchema = z.string();

export const GetTraducaoSchema = z.object({
  sl: z.string(),
  tl: z.string(),
  q: z.string(),
});
