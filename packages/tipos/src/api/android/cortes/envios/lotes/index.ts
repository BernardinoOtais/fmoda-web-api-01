import z from "zod";

import { InteiroNaoNegativoSchema, StringComTamanhoSchema } from "@/comuns";

export const GetCortesLotesSchema = z.object({
  controlo: InteiroNaoNegativoSchema,
  idEnvio: InteiroNaoNegativoSchema,
});

export const PostCortesLoteSchema = z.object({
  nomeUser: z.string(),
  codigoIcf: StringComTamanhoSchema(40, 5),
  idEnvio: InteiroNaoNegativoSchema,
  qtdeAlterada: InteiroNaoNegativoSchema,
  nLote: InteiroNaoNegativoSchema,
});

export const DeleteCortesLoteSchema = z.object({
  idEnvio: InteiroNaoNegativoSchema,
  codigoIcf: StringComTamanhoSchema(40, 5),
});
