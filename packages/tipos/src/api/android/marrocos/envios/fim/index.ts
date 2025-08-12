import z from "zod";

import { InteiroNaoNegativoSchema } from "@/comuns";

export const GetPesos = z.object({
  idEnvioMarrocos: InteiroNaoNegativoSchema,
});

const EnvioMarrocosFimRowSchema = z.object({
  idEnvioMarrocos: InteiroNaoNegativoSchema,
  clifor: z.string(),
  nomeClifor: z.string(),
  dados: z.string(),
});

export const EnvioMarrocosFimRowsSchema = z.array(EnvioMarrocosFimRowSchema);

export const ListaPedidosEPesos = z.object({
  listaPedidosEPesos: z.string(),
});

const EnvioMarrocosFimResumoSchema = z.object({
  idEnvioMarrocos: InteiroNaoNegativoSchema,
  nomeEnvio: z.string(),
  clifor: z.string(),
  nomeClifor: z.string(),
  opPedidosCorParteQtde: z.string(),
});

export const EnvioMarrocosFimResumoRowsSchema = z.array(
  EnvioMarrocosFimResumoSchema
);

export const TerminaEnvioSchema = z.object({
  idEnvioMarrocos: InteiroNaoNegativoSchema,
});
