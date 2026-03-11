import z from "zod";

import { StringPersonalizada } from "@/index";

export const FornecedorNoSchema = z.object({
  value: StringPersonalizada(10, 1),
});
export type FornecedorNoDto = z.infer<typeof FornecedorNoSchema>;

export const NoSchema = z.string();

export const ContaCorrenteSchema = z.array(
  z.object({
    dataCompra: z.coerce.date().nullable(),
    dataDoc: z.coerce.date().nullable(),
    dataVen: z.coerce.date().nullable(),
    doc: z.string(),
    nDoc: z.string().nullable(),
    edeb: z.coerce.number(),
    ecred: z.coerce.number(),
    valorAcumulado: z.coerce.number().nullable(),
  }),
);
export type ContaCorrenteSDto = z.infer<typeof ContaCorrenteSchema>;
