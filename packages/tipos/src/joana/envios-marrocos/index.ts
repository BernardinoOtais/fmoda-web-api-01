import z from "zod";

import { StringComTamanhoSchema } from "@/comuns";
import { safeJsonArray } from "@/index";

export const PesquisaEnviosMarrocosSchema = z
  .object({
    dataIni: z.date().nullable(),
    dataFini: z.date().nullable(),
    op: z.number().nullable(),
  })
  .superRefine((data, ctx) => {
    const { dataIni, dataFini, op } = data;

    if (op === null) {
      if (!dataIni) {
        ctx.addIssue({
          code: "custom",
          message: "Data inicial tem que ser inserida",
          path: ["dataIni"],
        });
      }

      if (!dataFini) {
        ctx.addIssue({
          code: "custom",
          message: "Data final tem que ser inserida...",
          path: ["dataFini"],
        });
      }

      if (dataIni && dataFini && dataIni >= dataFini) {
        ctx.addIssue({
          code: "custom",
          message: "Data inicial tem que ser superior à data final...",
          path: ["dataIni"],
        });
      }
    }
  });

const TamanhoOrdemQttSchema = z.object({
  tam: StringComTamanhoSchema(10, 1),
  ordem: z.coerce.number(),
  qtt: z.coerce.number(),
});
const QuanridadesSchema = z.array(TamanhoOrdemQttSchema);

//z.coerce.date()

const ParteQuantidadeSchema = z.object({
  descricaoParte: z.string(),
  quantidades: QuanridadesSchema,
});

const TotalDestinoSchema = z.array(ParteQuantidadeSchema);

const DataEnvioSchema = z.object({
  dataFim: z.coerce.date(),
  flag: z.coerce.boolean(),
  pater: z.array(ParteQuantidadeSchema),
});

const DatasEnvioSchema = z.array(DataEnvioSchema);

const EnviadoFornecedorDataLinhaSchema = z.object({
  destino: z.string(),
  totalDestinoT: TotalDestinoSchema,
  totalDestinoD: TotalDestinoSchema,
  datasEnvio: DatasEnvioSchema,
});

const EnviadoFornecedorDataSchema = z.array(EnviadoFornecedorDataLinhaSchema);

const EnvioMarrocoschema = z.object({
  obrano: z.coerce.number(),
  cliente: StringComTamanhoSchema(25, 1),
  design: StringComTamanhoSchema(60, 1),
  cor: StringComTamanhoSchema(25, 1),
  foto: StringComTamanhoSchema(500, 3),
  pedido: safeJsonArray(QuanridadesSchema),
  enviadoFornecedorData: safeJsonArray(EnviadoFornecedorDataSchema),
  totais: safeJsonArray(TotalDestinoSchema),
});

export const EnviosMarrocosSchema = z.array(EnvioMarrocoschema);

export type EnviosMarrocosDto = z.infer<typeof EnviosMarrocosSchema>;
