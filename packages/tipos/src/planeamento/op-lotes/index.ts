import z from "zod";

import {
  ChavePhcSchema,
  NumeroInteiroMaiorQueZero,
  StringComTamanhoSchema,
} from "@/comuns";
import { NumeroOuZero, safeJsonArray } from "@/index";

const QuantidadeSchema = z.object({
  tam: StringComTamanhoSchema(50, 1),
  ordem: z.coerce.number(),
  qtt: z.coerce.number(),
});
const QuantidadesSchema = z.array(QuantidadeSchema);

export type QuantidadesDto = z.infer<typeof QuantidadesSchema>;

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
  numeroPecaCaixa: z.coerce.number().positive(),
  qttTamanhosAJuntar: z.coerce.number().positive(),
});

export type DistPorCaixaDto = z.infer<typeof DistPorCaixaSchema>;

const CaixaSchema = z.object({
  case_no: NumeroInteiroMaiorQueZero,
  quantidades: QuantidadesSchema,
});

const CaixasSchema = z.array(CaixaSchema);

const PackSchema = z.object({
  idLote: z.coerce.number(),
  nLotesCaixa: z.coerce.number(),
  nLotesTotal: z.coerce.number(),
  quantidades: QuantidadesSchema,
});

const PacksSchema = z.array(PackSchema);
export type PacksDto = z.infer<typeof PacksSchema>;

const DistPorCaixaDistSchema = z.object({
  ref: StringComTamanhoSchema(19, 1),
  Pais: StringComTamanhoSchema(500, 3),
  tamanhos: z.array(
    z.object({
      tam: StringComTamanhoSchema(50, 1),
      ordem: z.coerce.number(),
    }),
  ),
  packs: PacksSchema,
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

export const QuantidadeParaPostSchema = z.array(
  z.object({
    tam: z.string(),
    ordem: z.number().int(),
    qtt: z.number().int().nonnegative(),
  }),
);

export const PostLoteSchema = z.object({
  bostamp: ChavePhcSchema,
  ref: StringComTamanhoSchema(19, 1),
  nLotesCaixa: z.number().int().nonnegative(),
  nLotesTotal: z.number().int().positive(),
  lotes: QuantidadeParaPostSchema,
});

export type PostLoteDto = z.infer<typeof PostLoteSchema>;

export const DeleteLotesSchema = z.object({
  idLote: NumeroInteiroMaiorQueZero,
  bostamp: ChavePhcSchema,
  ref: StringComTamanhoSchema(19, 1),
});

/*
		@idLote int,
		@bostamp char(25),
		@ref char(18),
		@userName NVARCHAR(50) = NULL 
*/
