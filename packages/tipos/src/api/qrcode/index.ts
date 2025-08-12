import z from "zod";

export const NovoQrcodeSchema = z.object({
  dados: z.string(),
  nome: z.string(),
});
