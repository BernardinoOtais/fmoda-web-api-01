import z from "zod";

import { InteiroNaoNegativoSchema } from "@/comuns";

export const GetResumoSchema = z.object({
  op: InteiroNaoNegativoSchema,
});

const DadosResumoLinhaSchema = z.object({
  op: InteiroNaoNegativoSchema,
  cliente: z.string(),
  pedidoDoCliente: z.string(),
  modelo: z.string(),
  descricao: z.string(),
  foto: z.string(),
  pedido: z.string(),
  enviado: z.string(),
  enviadoFornecedor: z.string(),
  enviadoTotalPorPartes: z.string(),
  faltaEnviar: z.string(),
  phc: z.string(),
  malha: z.string(),
  resumoResumo: z.string(),
});

export const DadosResumoLinhasSchema = z.array(DadosResumoLinhaSchema);
