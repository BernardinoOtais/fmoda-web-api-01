import z from "zod";

import { InteiroNaoNegativoSchema, StringComTamanhoSchema } from "@/comuns";

export const GetCaixasSchema = z.object({
  idEnvioMarrocosPalete: InteiroNaoNegativoSchema,
});

export const JuntaCaixasSchema = z.object({
  idEnvioMarrocosCaixas: InteiroNaoNegativoSchema,
  idEnvioMarrocosPalete: InteiroNaoNegativoSchema,
});

export const PostNovaCaixaSchema = z.object({
  idEnvioMarrocosPalete: StringComTamanhoSchema(15, 3),
  nomeUser: StringComTamanhoSchema(25, 1),
  codIcf: StringComTamanhoSchema(40, 5),
});

export const DeleteCaixasSchema = z.object({
  idEnvioMarrocosCaixas: InteiroNaoNegativoSchema,
});

export const PostSubstituiCaixaSchema = z.object({
  idEnvioMarrocosCaixas: InteiroNaoNegativoSchema,
  nomeUser: StringComTamanhoSchema(25, 1),
  codIcf: StringComTamanhoSchema(40, 5),
});

export const PatchQuantidadeDaCaixaSchema = z.object({
  idEnvioMarrocosCaixas: InteiroNaoNegativoSchema,
  nomeUser: StringComTamanhoSchema(25, 1),
  valorInserido: InteiroNaoNegativoSchema,
});

export const DeleteListaCaixasBodySchema = z.object({
  idEnvioMarrocosCaixas: z.string(),
});

export const DeleteListaCaixasQuerySchema = z.object({
  idEnvioMarrocosPalete: InteiroNaoNegativoSchema,
});
