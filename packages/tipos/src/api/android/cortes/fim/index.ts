import z from "zod";

import {
  ChavePhcSchema,
  InteiroNaoNegativoSchema,
  VerdadeiroOuFalsoSchema,
} from "@/comuns";

export const GetRecursosSchema = z.object({
  opLotes: InteiroNaoNegativoSchema,
});

export const GetFornecedoresSchema = z.object({
  opLotes: InteiroNaoNegativoSchema,
  faseProducao: ChavePhcSchema,
  sectorProd: ChavePhcSchema,
  naOP: VerdadeiroOuFalsoSchema,
  parteRec: z.string().optional(),
});

export const PostFimDeEnvioSchema = z.object({
  faseLinx: ChavePhcSchema,
  idEnvio: InteiroNaoNegativoSchema,
  ip: z.string(),
  nLotes: InteiroNaoNegativoSchema,
  nomeUser: z.string(),
  recursoLinx: z.string(),
  sectorLinx: ChavePhcSchema,
});
