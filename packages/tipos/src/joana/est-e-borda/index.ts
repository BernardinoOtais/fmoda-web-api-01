import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

const QuantidadeSchema = z.object({
  ordem: z.coerce.number(),
  tam: StringComTamanhoSchema(10, 1),
  qttT: z.coerce.number(),
  qtt: z.coerce.number(),
});

const FornecedorDetalheSchema = z.object({
  fornecedor: StringComTamanhoSchema(200, 1),
  enviado: z.array(QuantidadeSchema).default([]),
  recebido: z.array(QuantidadeSchema).default([]),
});

export const FornecedoresSchema = z
  .array(
    z.object({
      fornecedor: StringComTamanhoSchema(200, 1),
    })
  )
  .default([]);

export const DetalheSchema = z
  .array(
    z.object({
      enviadoRecebidoFornecedor: z.array(FornecedorDetalheSchema).default([]),
      totais: z
        .array(
          z.object({
            enviado: z.array(QuantidadeSchema).default([]),
            recebido: z.array(QuantidadeSchema).default([]),
          })
        )
        .default([]),
    })
  )
  .default([]);

export const EstampadoEBordadoSchema = z.object({
  op: z.coerce.number(),
  foto: StringComTamanhoSchema(500, 3),
  tipoServico: StringComTamanhoSchema(100, 1),
  enviado: StringComTamanhoSchema(19, 1),
  nomeEnviado: StringComTamanhoSchema(60, 1),
  recebido: StringComTamanhoSchema(19, 1),
  nomeRecebido: StringComTamanhoSchema(60, 1),
  fornecedores: safeJsonArray(FornecedoresSchema),
  detalhe: safeJsonArray(DetalheSchema),
});
export const EstampadosEBordadosSchema = z.array(EstampadoEBordadoSchema);

export type EstampadosEBordadosDto = z.infer<typeof EstampadosEBordadosSchema>;

export type EstampadoEBordadoDto = z.infer<typeof EstampadoEBordadoSchema>;
