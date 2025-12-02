import { z } from "zod";

import { StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

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

const DetalheMobileSchema = z.object({
  nmdoc: z.string(),
  fno: z.coerce.number(),
  fdata: z.coerce.date(), // coerces string → Date
  qtt: z.coerce.number(),
  epv: z.coerce.number(),
  total: z.coerce.number(),
});
export const FaturacaoMobileLinhaSchema = z.object({
  obrano: z.coerce.number(),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(25, 1),
  foto: StringComTamanhoSchema(500, 3),
  cliente: StringComTamanhoSchema(25, 1),
  totalGrupo: z.coerce.number(),
  detalhe: z.array(DetalheMobileSchema),
});

export const FaturacaoWebLinhaSchema = z.object({
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

export const FaturacaoWebSchema = z.array(FaturacaoWebLinhaSchema);
export const FaturacaoMobileSchema = z.array(FaturacaoMobileLinhaSchema);

export const FaturacaoSchema = z.object({
  totalGeral: z.coerce.number(),
  faturacaoWeb: safeJsonArray(FaturacaoWebSchema),
  faturacaoMobile: safeJsonArray(FaturacaoMobileSchema),
});

export type FaturacaoWebLinhaDto = z.infer<typeof FaturacaoWebLinhaSchema>;
export type FaturacaoWebDto = z.infer<typeof FaturacaoWebSchema>;
export type FaturacaoDto = z.infer<typeof FaturacaoSchema>;

export type FaturacaoMovelDto = z.infer<typeof FaturacaoMobileSchema>;
