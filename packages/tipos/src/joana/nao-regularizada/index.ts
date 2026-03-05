import z from "zod";

import { StringPersonalizada } from "@/index";

export const FornecedorNoSchema = z.object({
  value: StringPersonalizada(10, 1),
});
export type FornecedorNoDto = z.infer<typeof FornecedorNoSchema>;

export const NoSchema = z.string();

export const NaoRegularizadoSchema = z.array(
  z.object({
    cPagamento: z.string(),
    tipoDoc: z.string(),
    nDOc: z.string(),
    ultdoc: z.string(),
    docdata: z.coerce.date(),
    datalc: z.coerce.date(),
    dataven: z.coerce.date(),
    valor: z.coerce.number(),
    valorAcumulado: z.coerce.number(),
    idadeEmissao: z.number(),
    idadeVencimento: z.number(),
    intid: z.string(),
  }),
);
export type NaoRegularizadoDto = z.infer<typeof NaoRegularizadoSchema>;
