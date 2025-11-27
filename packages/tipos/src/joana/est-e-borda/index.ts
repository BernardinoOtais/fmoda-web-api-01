import z from "zod";

import { ChavePhcSchema, StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

const TamanhoOrdemQttSchema = z.object({
  tam: StringComTamanhoSchema(10, 1),
  ordem: z.coerce.number(),
  qtt: z.coerce.number(),
});
const TamanhosQuantidadeSchema = z.array(TamanhoOrdemQttSchema);
const FornecedorSchema = z.object({
  fornecedor: StringComTamanhoSchema(200, 1),
  enviado: TamanhosQuantidadeSchema,
  recebido: TamanhosQuantidadeSchema,
});

const TotaisSchema = z.object({
  enviado: TamanhosQuantidadeSchema,
  recebido: TamanhosQuantidadeSchema,
});

const FornecedoresEstBordSchema = z.array(FornecedorSchema);

const BordadosEEstampadosSchema = z.array(
  z.object({
    tipoServico: StringComTamanhoSchema(100, 1),
    detalhe: z.array(
      z.object({
        enviado: StringComTamanhoSchema(19, 1),
        nomeEnviado: StringComTamanhoSchema(60, 1),
        recebido: StringComTamanhoSchema(19, 1),
        nomeRecebido: StringComTamanhoSchema(60, 1),
        fornecedores: FornecedoresEstBordSchema,
        totais: z.array(TotaisSchema),
      })
    ),
  })
);

export const EstampadoEBordadoSchema = z.object({
  bostamp: ChavePhcSchema,
  obrano: z.coerce.number(),
  cliente: StringComTamanhoSchema(25, 1),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(25, 1),
  foto: StringComTamanhoSchema(500, 3),
  bordadosEEstampados: safeJsonArray(BordadosEEstampadosSchema),
});
export const EstampadosEBordadosSchema = z.array(EstampadoEBordadoSchema);

export type EstampadosEBordadosDto = z.infer<typeof EstampadosEBordadosSchema>;

export type EstampadoEBordadoDto = z.infer<typeof EstampadoEBordadoSchema>;

export type FornecedoresEstBordDto = z.infer<typeof FornecedoresEstBordSchema>;

export const OpSchema = z.object({
  op: z.number().nullable(),
  veEscondidas: z.boolean().nullable(),
});
export const EscondeMostraSchema = z.object({
  bostamp: ChavePhcSchema,
});
