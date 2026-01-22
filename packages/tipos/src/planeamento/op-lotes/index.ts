import z from "zod";

import {
  ChavePhcSchema,
  NumeroInteiroMaiorQueZero,
  StringComTamanhoSchema,
} from "@/comuns";
import { safeJsonArray } from "@/index";

const QuantidadeSchema = z.object({
  tam: StringComTamanhoSchema(50, 1),
  ordem: z.coerce.number(),
  qtt: z.coerce.number(),
});
const QuantidadesSchema = z.array(QuantidadeSchema);

const DistPorCaixaSchema = z
  .object({
    numeroPecaCaixa: z.coerce.number(),
    qttTamanhosAJuntar: z.coerce.number(),
  })
  .nullable();

export const OpSchema = z.object({
  bostamp: ChavePhcSchema,
  obrano: z.coerce.number(),
  cliente: StringComTamanhoSchema(500, 3),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(25, 3),
  foto: StringComTamanhoSchema(500, 3),
  quantidades: safeJsonArray(QuantidadesSchema),
  distPorCaixa: safeJsonArray(DistPorCaixaSchema),
});

export type OpDto = z.infer<typeof OpSchema>;

export const OPschema = z.object({
  op: NumeroInteiroMaiorQueZero,
});

export const PostdistPorCaixaSchema = z.object({
  bostamp: ChavePhcSchema,
  numeroPecaCaixa: z.coerce.number(),
  qttTamanhosAJuntar: z.coerce.number(),
});

export type DistPorCaixaDto = z.infer<typeof DistPorCaixaSchema>;

const CaixaSchema = z.object({
  case_no: NumeroInteiroMaiorQueZero,
  quantidades: QuantidadesSchema,
});

const CaixasSchema = z.array(CaixaSchema);

const DistPorCaixaDistSchema = z.object({
  ref: StringComTamanhoSchema(19, 1),
  Pais: StringComTamanhoSchema(500, 3),
  tamanhos: z.array(
    z.object({
      tam: StringComTamanhoSchema(50, 1),
      ordem: z.coerce.number(),
    }),
  ),
  singles: CaixasSchema,
  totalSingle: QuantidadesSchema,
});

const DistPorCaixasDistSchema = z.array(DistPorCaixaDistSchema);

export const GetLotesSchema = z.object({
  totalCaixasSingle: z.coerce.number(),
  totalCaixasSingleCompletas: z.coerce.number(),
  totalCaixasSingleComQuantidadeInferiorAoPrevisto: z.coerce.number(),
  totalCaixasSingleComMaisQueUmTamanho: z.coerce.number(),
  dadosSingle: safeJsonArray(DistPorCaixasDistSchema),
});

export type GetLotesDto = z.infer<typeof GetLotesSchema>;

export const GetOpLotesDistSchema = z.object({
  Obrano: NumeroInteiroMaiorQueZero,
  CaseCapacity: NumeroInteiroMaiorQueZero,
  MaxSizesPerCase: NumeroInteiroMaiorQueZero,
});
