import { z } from "zod";

import {
  ChavePhcSchema,
  InteiroNaoNegativoSchema,
  StringComTamanhoSchema,
  VerdadeiroOuFalsoSchema,
} from "@/comuns";

export const NewIdSql = z.string().uuid();

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

export type AutocompleteDto = {
  value: number;
  label: string;
};
//AutocompleteStringSchema e AutocompleteStringDto

//embarques/idEnvios
export const IdNumeroInteiroNaoNegativoSchema = z.object({
  id: InteiroNaoNegativoSchema,
  idd: InteiroNaoNegativoSchema.optional(),
});

export type IdNumeroInteiroNaoNegativoDto = z.infer<
  typeof IdNumeroInteiroNaoNegativoSchema
>;
//embarques/idEnvios

export const NumeroOuZero = z.preprocess(
  (input) => {
    if (typeof input === "string") {
      const normalized = input.replace(",", ".");
      const num = parseFloat(normalized);
      return isNaN(num) ? 0 : num;
    }

    const coerced = Number(input);
    return isNaN(coerced) ? 0 : coerced;
  },
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Tem que inserrir números..."
          : "Formato errado...",
    })
    .min(0, { message: "Qtde positiva..." })
);

export {
  FloatZeroSchema,
  InteiroNaoNegativoSchema,
  FotoPropSchema,
} from "./comuns";

export const RespostaSchema = z.object({
  status: z.string(),
  errorMessage: z.string().nullable(),
  successMessage: z.string().optional(),
  id: InteiroNaoNegativoSchema.optional(),
});
export const RespostaRecebidaSchema = z.array(RespostaSchema);

export type NewIdSqlDto = z.infer<typeof NewIdSql>;

export const StringPersonalizada = (tamanho: number, minimo?: number) =>
  StringComTamanhoSchema(tamanho, minimo);

export const NumeroInteiro = z.coerce
  .number({
    error: (issue) =>
      issue.input === undefined
        ? "Tem que inserrir números..."
        : "Formato errado...",
  })
  .int({ message: "Tem que ser inteiro...." }) as z.ZodNumber;
