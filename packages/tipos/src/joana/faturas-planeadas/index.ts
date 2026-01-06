import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

export const PesquisaFaturasPlaneadasSchema = z
  .object({
    dataIni: z.date().nullable(),
    dataFini: z.date().nullable(),
    fornecedor: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    const { dataIni, dataFini, fornecedor } = data;

    if (fornecedor === null) {
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

const FornecedoresSchema = z.object({
  nome: z.string(),
  valorServico: z.coerce.number(),
});
const DetalheSchema = z.object({
  obrano: z.coerce.number(),
  pedido: z.string(),
  design: StringComTamanhoSchema(60, 1),
  foto: StringComTamanhoSchema(500, 3),
  cliente: StringComTamanhoSchema(25, 1),
  tipo: z.string(),
  qtt: z.coerce.number(),
  nPrecosDif: z.coerce.number(),
  u_total: z.coerce.number(),
  valorTotail: z.coerce.number(),
  fornecedores: z.array(FornecedoresSchema),
});
const DataSemandaSchema = z.object({
  data: z.coerce.date(), // coerces string → Date
  spanData: z.coerce.number(),
  detalhe: z.array(DetalheSchema),
});
const SemanaLinhaSchema = z.object({
  SemanaNumero: z.coerce.number(),
  spanSemana: z.coerce.number(),
  valorServicoT: z.coerce.number(),
  qtt: z.coerce.number(),
  valorTotalFatura: z.coerce.number(),
  dataSemanda: z.array(DataSemandaSchema),
});

const SemanaMovelSchema = z.array(SemanaLinhaSchema);

export const FaturasPlaneadasSchema = z.object({
  dados: safeJsonArray(SemanaMovelSchema),
  valorTotalAPagar: z.coerce.number(),
  qttTotal: z.coerce.number(),
  valorTotalAReceber: z.coerce.number(),
});

export type FaturasPlaneadasDto = z.infer<typeof FaturasPlaneadasSchema>;
