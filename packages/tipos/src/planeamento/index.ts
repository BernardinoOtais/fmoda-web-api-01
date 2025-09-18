import z from "zod";

import { ChavePhcSchema, NumeroInteiroMaiorQueZero } from "@/comuns";

export type { PlaneamentoLinha } from "./planeamentos-tipo";

export type PlaneamentoOpsNaoPlaneadas = {
  id: string;
  op: string;
  modelo: string;
  descricao: string;
  pedido: string;
  corNome: string;
  quantidade: string;
  departamento: string;
  foto: string;
};

export type PlaneamentoPostOps = {
  op_chave: string;
  op: string;
  ref: string;
  modelo: string;
  descricao: string;
  pedido: string;
  corNome: string;
  quantidade: string;
  departamento: string;
  foto: string;
};

//Novo planeamento
export const GetPlaneamentosSchemas = z.object({
  enviado: z.boolean(),
  sub_contratado_id: ChavePhcSchema.optional(),
});

export const QantidadeOpSchema = NumeroInteiroMaiorQueZero;
export const OpSchema = NumeroInteiroMaiorQueZero;
export const PosNovoPlaneamentoSchema = z.object({
  idDestino: ChavePhcSchema,
  ops: z.array(
    z.object({
      op: NumeroInteiroMaiorQueZero,
    })
  ),
  maisQueUmaOP: z.boolean(),
});
//Novo planeamento

export type PosNovosPlaneamentosDto = z.infer<typeof PosNovoPlaneamentoSchema>;
