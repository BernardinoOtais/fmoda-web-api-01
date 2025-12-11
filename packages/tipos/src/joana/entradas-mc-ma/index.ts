import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

const MalhaSchema = z.object({
  design: StringComTamanhoSchema(60, 1),
  qtt: z.coerce.number(),
  recebido: z.coerce.number(),
  enviado: z.coerce.number(),
  unidade: z.string(),
});

const DetalheMalhaSchema = z.object({
  perfix: StringComTamanhoSchema(2, 1),
  detalheMalhaSpan: z.coerce.number(),
  malhas: z.array(MalhaSchema),
});

const DetalhesMalhaSchema = z.array(DetalheMalhaSchema);

export const MalhasEntradasMcMaSchema = z.object({
  obrano: z.coerce.number(),
  cliente: StringComTamanhoSchema(25, 1),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(25, 1),
  foto: StringComTamanhoSchema(500, 3),
  spanOp: z.coerce.number(),
  detalheMalha: safeJsonArray(DetalhesMalhaSchema),
});

export const MalhasEntradasMcMaListaSchema = z.array(MalhasEntradasMcMaSchema);
export type MalhasEntradasMcMaDto = z.infer<typeof MalhasEntradasMcMaSchema>;

export const OpSchema = z.object({
  op: z.number().nullable(),
});
