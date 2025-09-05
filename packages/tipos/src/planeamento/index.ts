import z from "zod";

import {
  ChavePhcSchema,
  NumeroInteiroMaiorQueZero,
  StringComTamanhoSchema,
} from "@/comuns";

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

//Novo planeamento
export const PosNovoPlaneamentoSchema = z.object({
  idDestino: ChavePhcSchema,
  op: NumeroInteiroMaiorQueZero.optional(),
  modelo: StringComTamanhoSchema(15, 4),
});

export type PosNovoPlaneamentoDto = z.infer<typeof PosNovoPlaneamentoSchema>;
//Novo planeamento
