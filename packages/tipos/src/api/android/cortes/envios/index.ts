import z from "zod";

import { InteiroNaoNegativoSchema } from "@/comuns";

export const GetEnviosSchema = z.object({
  opIcf: z.string(),
});

export const PostCortesEnvioSchema = z.object({
  nomeUser: z.string(),
});

export const DeleteCortesEnvioSchema = z.object({
  nomeUser: z.string(),
  idEnvio: InteiroNaoNegativoSchema,
});
