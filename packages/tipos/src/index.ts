import { z } from "zod";
import { InteiroNaoNegativoSchema, VerdadeiroOuFalsoSchema } from "@/comuns";

export const DadosParaPesquisaComPaginacaoEOrdemSchema = z.object({
  skip: InteiroNaoNegativoSchema,
  take: InteiroNaoNegativoSchema,
  fechado: VerdadeiroOuFalsoSchema,
  ordem: z.enum(["asc", "desc"]).optional(),
});

export type DadosParaPesquisaComPaginacaoEOrdemDto = z.infer<
  typeof DadosParaPesquisaComPaginacaoEOrdemSchema
>;
