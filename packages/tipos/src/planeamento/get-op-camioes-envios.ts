import z from "zod";

import {
  ChavePhcSchema,
  NumeroInteiroMaiorQueZero,
  StringComTamanhoSchema,
} from "@/comuns";
import { DateSchema, NumeroOuZero } from "@/index";

// Subschemas
const QuantidadeSchema = z.object({
  tam: StringComTamanhoSchema(25, 1),
  qtt: NumeroInteiroMaiorQueZero,
  ordem: NumeroInteiroMaiorQueZero,
});

const DetalheSchema = z.object({
  atedata: DateSchema,
  cor: StringComTamanhoSchema(25, 3),
  quantidades: z.array(QuantidadeSchema),
});

const CamiaoOuEnvioSchema = z.object({
  n: NumeroInteiroMaiorQueZero,
  dataIn: DateSchema,
  valor: NumeroOuZero,
});

export const FornecedorSchema = StringComTamanhoSchema(200, 0).optional();

// Root schema
export const OpCamioesEnviosSchema = z.object({
  stamp: ChavePhcSchema,
  op: NumeroInteiroMaiorQueZero,
  client: StringComTamanhoSchema(25, 3),
  foto: StringComTamanhoSchema(500, 3),
  modelo: StringComTamanhoSchema(25, 0).optional(),
  area: StringComTamanhoSchema(25, 3),
  pedido: StringComTamanhoSchema(25, 3),
  obs: StringComTamanhoSchema(200),
  qttTotal: NumeroInteiroMaiorQueZero,
  detalhe: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val) as unknown[];
      } catch {
        return [];
      }
    })
    .pipe(z.array(DetalheSchema)),
  fornecedor: FornecedorSchema,
  camioes: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val) as unknown[];
      } catch {
        return [];
      }
    })
    .pipe(z.array(CamiaoOuEnvioSchema)),
  envios: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val) as unknown[];
      } catch {
        return [];
      }
    })
    .pipe(z.array(CamiaoOuEnvioSchema)),
});
