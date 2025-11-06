import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";

export const MalhasEntradasMcMaSchema = z.object({
  op: z.coerce.number(),
  foto: StringComTamanhoSchema(500, 3),
  ref: StringComTamanhoSchema(18, 1),
  design: StringComTamanhoSchema(60, 1),
  pedido: z.coerce.number(),
  enviado: z.coerce.number(),
  recebido: z.coerce.number(),
  unidade: StringComTamanhoSchema(4, 1),
});

export const MalhasEntradasMcMaListaSchema = z.array(MalhasEntradasMcMaSchema);
export type MalhasEntradasMcMaDto = z.infer<typeof MalhasEntradasMcMaSchema>;
