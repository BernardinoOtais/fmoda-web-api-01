import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";

// 🧩 Common schemas
const QuantidadeSchema = z.object({
  ordem: z.coerce.number(),
  tam: StringComTamanhoSchema(10, 1),
  qtt: z.coerce.number(),
});

const FornecedorDetalheSchema = z.object({
  fornecedor: StringComTamanhoSchema(200, 1),
  enviado: z.array(QuantidadeSchema).default([]),
  recebido: z.array(QuantidadeSchema).default([]),
});

// 🧾 Top-level group schemas
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
      fornecedor: z.array(FornecedorDetalheSchema).default([]),
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

// 🧠 JSON parsing helper
const safeJsonArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return val;
  }, schema);

// 🏗️ Final schema
export const EstampadosEBordadosSchema = z.array(
  z.object({
    op: z.coerce.number(),
    foto: StringComTamanhoSchema(500, 3),
    enviado: StringComTamanhoSchema(19, 1),
    nomeEnviado: StringComTamanhoSchema(60, 1),
    recebido: StringComTamanhoSchema(19, 1),
    nomeRecebido: StringComTamanhoSchema(60, 1),
    fornecedores: safeJsonArray(FornecedoresSchema),
    detalhe: safeJsonArray(DetalheSchema),
  })
);

export type EstampadosEBordadosDto = z.infer<typeof EstampadosEBordadosSchema>;
