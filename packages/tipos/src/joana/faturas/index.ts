import { z } from "zod";

import { StringComTamanhoSchema } from "@/comuns";

export const PesquisaFaturasSchema = z
  .object({
    dataIni: z.date().nullable(),
    dataFini: z.date().nullable(),
    op: z.number().nullable(),
  })
  .superRefine((data, ctx) => {
    const { dataIni, dataFini, op } = data;

    if (op === null) {
      if (!dataIni) {
        ctx.addIssue({
          code: "custom",
          message: "Data inicial tem que ser inserida",
          path: ["dataIni"],
        });
      }

      if (!dataFini) {
        ctx.addIssue({
          code: "custom",
          message: "Data final tem que ser inserida...",
          path: ["dataFini"],
        });
      }

      if (dataIni && dataFini && dataIni >= dataFini) {
        ctx.addIssue({
          code: "custom",
          message: "Data inicial tem que ser superior à data final...",
          path: ["dataIni"],
        });
      }
    }
  });
export const FaturacaoLinhaSchema = z.object({
  nmdoc: z.string(),
  fno: z.coerce.number(),
  fdata: z.coerce.date(), // coerces string → Date
  obrano: z.coerce.number(),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(25, 1),
  foto: StringComTamanhoSchema(500, 3),
  cliente: StringComTamanhoSchema(25, 1),
  qtt: z.coerce.number(),
  epv: z.coerce.number(),
  total: z.coerce.number(),
});

export const FaturacaoSchema = z.array(FaturacaoLinhaSchema);

export type FaturacaoLinhaDto = z.infer<typeof FaturacaoLinhaSchema>;

export type FaturacaoDto = z.infer<typeof FaturacaoSchema>;
