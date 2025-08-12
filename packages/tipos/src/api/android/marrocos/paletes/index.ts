import z from "zod";

import { InteiroNaoNegativoSchema, StringComTamanhoSchema } from "@/comuns";

export const GetPaletesSchema = z.object({
  idEnvioMarrocos: InteiroNaoNegativoSchema,
});

export const PostNovaPaleteSchema = z.object({
  idEnvioMarrocos: InteiroNaoNegativoSchema,
  nomeUser: StringComTamanhoSchema(10, 1),
});
