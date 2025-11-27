import { z } from "zod";

import {
  ChavePhcSchema,
  InteiroNaoNegativoSchema,
  StringComTamanhoSchema,
} from "../comuns/index";
import { AutocompleteStringSchema } from "../index";

export const CsvRowRfidSchema = z.object({
  order_id: z.string().min(1, "order_id is required"),
  carton_id: z.string().optional(),
  epc: z.string().min(1, "epc is required"),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "timestamp must be a valid ISO date string",
  }),
});

export const PedidoSchema = z.object({
  pedido: z.string().min(1, "carton_id is required"),
});

export const CsvRowsRfidSchema = z.array(CsvRowRfidSchema);

export const PedidosSchema = z.array(PedidoSchema);

export const PostRfidSchema = z.object({
  rows: CsvRowsRfidSchema,
  pedidos: PedidosSchema,
  idDestino: ChavePhcSchema,
});

export type PostRfidDto = z.infer<typeof PostRfidSchema>;

export type CsvRowsRfidDto = z.infer<typeof CsvRowsRfidSchema>;

export type PedidosDto = z.infer<typeof PedidosSchema>;

export const RfidCorrespondenciaSchema = z.object({
  order_id: z.string().min(1, "order_id is required"),
  obrano: InteiroNaoNegativoSchema,
  idFornecedor: ChavePhcSchema,
});

export const PostRfidFinalSchema = z.object({
  rows: CsvRowsRfidSchema,
  correspodencia: z.array(RfidCorrespondenciaSchema),
});

export type PostRfidFinalDto = z.infer<typeof PostRfidFinalSchema>;

export const RfidOpFornecedorSchema = z.object({
  obrano: InteiroNaoNegativoSchema,
  u_tpestamp: StringComTamanhoSchema(60, 1),
  tabela2: StringComTamanhoSchema(60, 1),
  marca: StringComTamanhoSchema(60, 1),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(60, 1),
  qtt: InteiroNaoNegativoSchema,
  fornecedores: z.array(AutocompleteStringSchema),
});

export const RfidDadosSchema = z.array(RfidOpFornecedorSchema);
export const RfidPedidoOpFornecedorSchema = z.object({
  pedido: StringComTamanhoSchema(60, 1),
  dados: RfidDadosSchema,
});

export type RfidDadosDto = z.infer<typeof RfidDadosSchema>;

export const RfidPedidosPedidoOpFornecedorSchema = z.object({
  pedidos: z.array(RfidPedidoOpFornecedorSchema),
});

export type RfidPedidosReturn = z.infer<
  typeof RfidPedidosPedidoOpFornecedorSchema
>;
