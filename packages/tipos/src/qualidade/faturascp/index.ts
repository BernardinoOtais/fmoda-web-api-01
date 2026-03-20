import z from "zod";

import { ChavePhcSchema, StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

const DadosOpSchema = z.object({
  obrano: z.coerce.number(),
  cliente: z.string(),
  design: z.string(),
  cor: z.string(),
  foto: z.string(),
});

const OpsComposicaoSchema = z.object({
  opStamp: ChavePhcSchema,
  dadosOp: safeJsonArray(DadosOpSchema),
  composicao: z.string(),
});
const composicaoSchema = z.array(OpsComposicaoSchema);

export const FaturasComposicaoPbEPl = z.object({
  fno: z.coerce.number(),
  ftstamp: ChavePhcSchema,
  u_pnet: z.coerce.number(),
  u_pbruto: z.coerce.number(),
  composicao: safeJsonArray(composicaoSchema),
});

export const FaturaGetSchema = z.object({
  ano: z
    .string()
    .min(1, { message: "Ano é obrigatório." })
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: "Ano deve ser um número válido.",
    }),

  fatura: z
    .string()
    .min(1, { message: "Fatura é obrigatória." })
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: "Fatura deve ser um número válido.",
    }),
});

export const PostPesoBrutoEPesoLiquido = z.object({
  ftstamp: ChavePhcSchema,
  u_pnet: z
    .string()
    .min(1, { message: "Ano é obrigatório." })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Ano deve ser um número válido.",
    }),

  u_pbruto: z
    .string()
    .min(1, { message: "Fatura é obrigatória." })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Fatura deve ser um número válido.",
    }),
});

export const PostComposicaoSchema = z.object({
  opStamp: ChavePhcSchema,
  composicao: StringComTamanhoSchema(150, 1),
});
