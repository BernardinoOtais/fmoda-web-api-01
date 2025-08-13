import z from "zod";

export const GoogleTranslateResponseSchema = z.tuple([
  z.array(
    z.tuple([
      z.string(), // original text
      z.string(), // translated text
      z.null(),
      z.null(),
      z.number(), // confidence or sentence count
    ])
  ),
  z.null(), // often null
  z.string(), // detected source language code
  z.null(),
  z.null(),
  z.null(),
  z.null(),
  z.array(z.any()), // often empty array
]);

export const GetTraducaoSchema = z.object({
  sl: z.string(),
  tl: z.string(),
  q: z.string(),
});
