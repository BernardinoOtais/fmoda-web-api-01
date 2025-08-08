import z from "zod";

import { InteiroNaoNegativoSchema, StringComTamanhoSchema } from "@/comuns";

export const NomeEnvioSchema = z.object({
  nomeEnvio: StringComTamanhoSchema(50),
});
export const NomeEnvioPostSchema = z.object({
  nomeEnvio: StringComTamanhoSchema(50, 4),
  nomeUser: StringComTamanhoSchema(25, 1),
});

export const EmvioApagaSchema = z.object({
  idEnvioMarrocos: InteiroNaoNegativoSchema,
});
