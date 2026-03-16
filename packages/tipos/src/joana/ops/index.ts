import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

const TamanhoOrdemQttSchema = z.object({
  tam: StringComTamanhoSchema(10, 1),
  ordem: z.coerce.number(),
  qtt: z.coerce.number(),
});

const PedidoSchema = z.object({
  ref: z.string(),
  dataEntrega: z.coerce.date(),
  detablhePedido: z.array(TamanhoOrdemQttSchema),
});
const PedidoTSchema = z.object({
  ref: z.string(),
  detablhePedido: z.array(TamanhoOrdemQttSchema),
});

const FaturadoSchema = z.object({
  fdata: z.coerce.date(),
  fno: z.coerce.number(),
  nmdoc: z.string(),
  ref: z.string(),
  detalheFaturado: z.array(TamanhoOrdemQttSchema),
  qttFaturada: z.coerce.number(),
  valor: z.coerce.number(),
});

const FaturadoTSchema = z.object({
  ref: z.string(),
  detalheFaturado: z.array(TamanhoOrdemQttSchema),
  qttFaturada: z.coerce.number(),
  valor: z.coerce.number(),
});

//fdata":"2024-09-12T00:00:00","fno":407,"nmdoc":"Invoice","ref":"PA0000005643520305","detalheFaturado
const OpSchema = z.object({
  bostamp: z.string(),
  obrano: z.coerce.number(),
  modelo: z.string(),
  pCliente: z.string(),
  cliente: z.string(),
  design: z.string(),
  cor: z.string(),
  foto: z.string(),
  qttPedida: z.coerce.number(),
  qttFaturada: z.coerce.number(),
  valorFaturada: z.coerce.number(),
  pedido: safeJsonArray(z.array(PedidoSchema)),
  pedidoT: safeJsonArray(z.array(PedidoTSchema)),
  faturado: safeJsonArray(z.array(FaturadoSchema)),
  faturadoT: safeJsonArray(z.array(FaturadoTSchema)),
});

export const PesquisaOpsSchema = z
  .object({
    op: z
      .string()
      .nullable()
      .refine((val) => val === null || !isNaN(parseInt(val, 10)), {
        message: "OP deve ser um número válido.",
      }),
    modelo: z.string().nullable(),
    pedido: z.string().nullable(),
  })
  .refine(
    (data) => {
      if (data.op !== null) return true;
      return data.modelo !== null || data.pedido !== null;
    },
    {
      message: "Se OP for nula, modelo ou pedido devem ser preenchidos.",
      path: ["op"],
    },
  );

export type PesquisaOpsDto = z.infer<typeof PesquisaOpsSchema>;

export const OpsSchema = z.array(OpSchema);

export type OpsDto = z.infer<typeof OpsSchema>;
