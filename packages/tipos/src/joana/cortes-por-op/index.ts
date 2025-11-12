import z from "zod";

import { ChavePhcSchema, StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

const TamanhoOrdemQttSchema = z.object({
  tam: StringComTamanhoSchema(10, 1),
  ordem: z.coerce.number(),
  qtt: z.coerce.number(),
});
const PedidoSchema = z.array(TamanhoOrdemQttSchema);

const ParteSchema = z.object({
  ref: StringComTamanhoSchema(19, 1),
  design: StringComTamanhoSchema(60, 1),
  cortado: z.array(TamanhoOrdemQttSchema),
});

const FornecedorCortadoSchema = z.object({
  fornecedor: StringComTamanhoSchema(200, 1),
  parte: z.array(ParteSchema),
});

const FornecedoresCortadoSchema = z.array(FornecedorCortadoSchema);

export const CortePorOpSchema = z.object({
  bostamp: ChavePhcSchema,
  obrano: z.coerce.number(),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(25, 1),
  foto: StringComTamanhoSchema(500, 3),
  pedido: safeJsonArray(PedidoSchema),
  cortes: safeJsonArray(FornecedoresCortadoSchema),
  total: safeJsonArray(z.array(ParteSchema)),
});

export const FornecedoresCortesSchema = z.array(CortePorOpSchema);

export type FornecedoresCortesDto = z.infer<typeof FornecedoresCortesSchema>;

export const OpSchema = z.object({
  op: z.number().nullable(),
});
