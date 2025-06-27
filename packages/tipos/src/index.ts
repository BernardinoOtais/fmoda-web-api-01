import { z } from "zod";
import {
  ChavePhcSchema,
  InteiroNaoNegativoSchema,
  StringComTamanhoSchema,
  VerdadeiroOuFalsoSchema,
} from "@/comuns";

export const DadosParaPesquisaComPaginacaoEOrdemSchema = z.object({
  skip: InteiroNaoNegativoSchema,
  take: InteiroNaoNegativoSchema,
  fechado: VerdadeiroOuFalsoSchema,
  ordem: z.enum(["asc", "desc"]).optional(),
});

export type DadosParaPesquisaComPaginacaoEOrdemDto = z.infer<
  typeof DadosParaPesquisaComPaginacaoEOrdemSchema
>;

//AutocompleteStringSchema e AutocompleteStringDto
export const AutocompleteStringSchema = z.object({
  value: ChavePhcSchema,
  label: StringComTamanhoSchema(60, 1),
});
export type AutocompleteStringDto = z.infer<typeof AutocompleteStringSchema>;
//AutocompleteStringSchema e AutocompleteStringDto
