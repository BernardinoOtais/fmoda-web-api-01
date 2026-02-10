import z from "zod";

import { ChavePhcSchema, StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

const TamanhoOrdemQttSchema = z.object({
  tam: StringComTamanhoSchema(10, 1),
  ordem: z.coerce.number(),
  qtt: z.coerce.number(),
});
const PedidoSchema = z.array(TamanhoOrdemQttSchema);

const TamanhosQuantidadeSchema = z.array(TamanhoOrdemQttSchema);

const ParteSchema = z.object({
  ref: StringComTamanhoSchema(19, 1),
  design: StringComTamanhoSchema(60, 1),
  cortado: TamanhosQuantidadeSchema,
});

const PartesSchema = z.array(ParteSchema);

const FornecedorCortadoSchema = z.object({
  fornecedor: StringComTamanhoSchema(200, 1),
  parte: PartesSchema,
});

const FornecedoresCortadoSchema = z.array(FornecedorCortadoSchema);

const ListaPartesSchema = safeJsonArray(z.array(ParteSchema));

export const CortePorOpSchema = z.object({
  bostamp: ChavePhcSchema,
  obrano: z.coerce.number(),
  cliente: StringComTamanhoSchema(25, 1),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(25, 1),
  foto: StringComTamanhoSchema(500, 3),
  pedido: safeJsonArray(PedidoSchema),
  cortes: safeJsonArray(FornecedoresCortadoSchema),
  total: ListaPartesSchema,
});

export const FornecedoresCortesSchema = z.array(CortePorOpSchema);

export type FornecedoresCortesDto = z.infer<typeof FornecedoresCortesSchema>;

export type TamanhosQuantidadeDto = z.infer<typeof TamanhosQuantidadeSchema>;

export type PartesDto = z.infer<typeof PartesSchema>;

export const OpSchema = z.object({
  op: z.number().nullable(),
  veEscondidas: z.boolean().nullable(),
});

export const EscondeMostraSchema = z.object({
  bostamp: ChavePhcSchema,
});
