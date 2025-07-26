import { z } from "zod";

import {
  InteiroNaoNegativoSchema,
  NewIdSql,
  NumeroInteiroMaiorQueZero,
  StringComTamanhoSchema,
} from "@/comuns";
import { NumeroInteiro } from "@/index";

export const NumeroOuZero = z.coerce
  .number({
    error: (issue) =>
      issue.input === undefined
        ? "Tem que inserrir números..."
        : "Formato errado...",
  })
  .min(0, { message: "Qtde positiva..." });

export const Numero = z.coerce.number({
  error: (issue) =>
    issue.input === undefined
      ? "Tem que inserrir números..."
      : "Formato errado...",
});

export const BmMalhasFioMovimentosSchema = z.object({
  idBm: NewIdSql,
  ref: StringComTamanhoSchema(18, 1),
  refOrigem: StringComTamanhoSchema(18, 1),
  op: InteiroNaoNegativoSchema,
  idBmMovimentosLote: NewIdSql,
  idMovimento: StringComTamanhoSchema(25),
  nMovimento: z.number().int(),
  nome: StringComTamanhoSchema(55, 1),
  idTipo: Numero,
  tipo: StringComTamanhoSchema(50, 1),
  qtt: Numero,
  unidade: StringComTamanhoSchema(4),
  lote: StringComTamanhoSchema(4000),
});

export const BmOpsPorMalhaFioSchema = z.object({
  idBm: NewIdSql,
  ref: StringComTamanhoSchema(18, 1),
  refOrigem: StringComTamanhoSchema(18, 1),
  op: NumeroInteiroMaiorQueZero,
  BmMalhasFioMovimentos: z.array(BmMalhasFioMovimentosSchema).optional(),
});

export const BmMalhasFioSchema = z.object({
  idBm: NewIdSql,
  ref: StringComTamanhoSchema(18, 1),
  refOrigem: StringComTamanhoSchema(18, 1),
  fio: StringComTamanhoSchema(60),
  grupo: StringComTamanhoSchema(3),
  subGrupo: StringComTamanhoSchema(3),
  qtdePedida: Numero,
  qtdeEntrada: Numero,
  defeitosStock: Numero,
  sobras: Numero,
  unidade: StringComTamanhoSchema(4),
  lote: StringComTamanhoSchema(4000),
  BmOpsPorMalhaFio: z.array(BmOpsPorMalhaFioSchema).optional(),
});

export const BmMalhasFio = z.array(BmMalhasFioSchema).optional();

const BmMovimentosLotesSchema = z.object({
  idBm: NewIdSql,
  ref: StringComTamanhoSchema(18, 1),
  op: InteiroNaoNegativoSchema,
  idBmMovimentosLote: NewIdSql,
  idMovimento: StringComTamanhoSchema(25),
  nMovimento: InteiroNaoNegativoSchema,
  nome: StringComTamanhoSchema(55, 1),
  idTipo: Numero,
  tipo: StringComTamanhoSchema(50, 1),
  qtt: Numero,
  unidade: StringComTamanhoSchema(4),
  lote: StringComTamanhoSchema(4000),
});

const BmOpsPorMalhaSchema = z.object({
  idBm: NewIdSql,
  ref: StringComTamanhoSchema(18, 1),
  op: Numero,
  BmMovimentosLotes: z.array(BmMovimentosLotesSchema).optional(),
});

export const BmMalhasSchema = z.object({
  idBm: NewIdSql,
  ref: StringComTamanhoSchema(18, 1),
  malha: StringComTamanhoSchema(60),
  grupo: StringComTamanhoSchema(3),
  subGrupo: StringComTamanhoSchema(3),
  qtdePedida: Numero,
  qtdeEntrada: Numero,
  qtdeEntradaSeUnidade: Numero.optional(),
  defeitosStock: Numero,
  sobras: Numero,
  unidade: StringComTamanhoSchema(4),
  lote: StringComTamanhoSchema(4000),
  BmOpsPorMalha: z.array(BmOpsPorMalhaSchema).optional(),
  BmMalhasFio,
});

export const BmMalhas = z.array(BmMalhasSchema).optional();

const BmOpFaturadoSchema = z.object({
  idBm: NewIdSql,
  op: InteiroNaoNegativoSchema,
  nFatutura: InteiroNaoNegativoSchema,
  fData: z.coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? "Tem que inserrir números..."
        : "Formato errado...",
  }),
  dataFatura: StringComTamanhoSchema(10),
  refModelo: StringComTamanhoSchema(50, 1),
  pedido: StringComTamanhoSchema(150),
  qtt: Numero /** cenas e coisas */,
  pesoLiquido: Numero,
  pesoBruto: Numero,
  cmr: StringComTamanhoSchema(150),
  local: StringComTamanhoSchema(150),
  obs: StringComTamanhoSchema(300).nullable(),
});

const BmOpSchema = z.object({
  idBm: NewIdSql,
  op: InteiroNaoNegativoSchema,
  CreatedAt: z.coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? "Tem que inserrir números..."
        : "Formato errado...",
  }),
  foto: z.string(),
  BmOpFaturado: z.array(BmOpFaturadoSchema).optional(),
});

export const BmOp = z.array(BmOpSchema).optional();

export const BmTcSchema = z.object({
  idBm: NewIdSql,
  nomeTc: StringComTamanhoSchema(100, 1),
});

export const BmSchema = z.object({
  idBm: NewIdSql,
  composicao: StringComTamanhoSchema(250),
  fechado: z.boolean(),
  BmMalhas,
  BmOp,
  BmTc: z.array(BmTcSchema).optional(),
});

export const BmSchemas = z.array(BmSchema).optional();

export const OPschema = z.object({
  op: NumeroInteiroMaiorQueZero,
});

export type OpDto = z.infer<typeof OPschema>;

export type BmFaturado = {
  fData: Date;
  nFatutura: number;
  qtt: number;
  pesoBruto: number;
  pesoLiquido: number;
}[];

export type BmTotais = {
  totalQtt: number;
  totalPesoBruto: number;
  totalPesoLiquido: number;
};

export type BmDadosParaConsumo = {
  malha: string;
  qttUsada: number;
}[];

export type BmOpDto = z.infer<typeof BmOp>;

export const BmTabelaSchema = z.object({
  idBm: NewIdSql,
  composicao: StringComTamanhoSchema(250),
  fechado: z.boolean(),
  CreatedAt: z.coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? "Tem que inserrir números..."
        : "Formato errado...",
  }),
});
export type BmTabelaDto = z.infer<typeof BmTabelaSchema>;

export const Composicao = z.object({
  composicao: StringComTamanhoSchema(250),
});
export const BmMalhasOpsSchema = z.object({
  BmMalhas,
  BmOp,
  Composicao,
});
export type BmMalhasOpsDto = z.infer<typeof BmMalhasOpsSchema>;

export type BmTcDto = z.infer<typeof BmTcSchema>;

export const listaOpsSchema = z.array(
  z.object({
    op: Numero,
    qtt: Numero,
  })
);

export const DeleteApagaMalhaSchema = z.object({
  op: NumeroInteiroMaiorQueZero,
  idBm: NewIdSql,
  ref: z.string().length(18),
});

export type DeleteApagaMalhaDto = z.infer<typeof DeleteApagaMalhaSchema>;

export const PostDeDefeitosSchema = z.object({
  op: z.string(),
  idBm: NewIdSql,
  ref: z.string().length(18),
  defeitosStock: NumeroOuZero,
});

export type PostDeDefeitosDto = z.infer<typeof PostDeDefeitosSchema>;

export const ReturnPostDeDefeitosSchema = z.object({
  idBm: NewIdSql,
  ref: z.string().length(18),
  defeitosStock: NumeroOuZero,
});

export const PostDeLotesSchema = z.object({
  ref: z.string().length(18),
  idBm: NewIdSql,
  lote: StringComTamanhoSchema(4000),
});

export type PostDeLotesDto = z.infer<typeof PostDeLotesSchema>;

export const IdBmOpSchema = z.object({
  idBm: NewIdSql,
  op: NumeroInteiroMaiorQueZero,
});

export type IdBmOpDto = z.infer<typeof IdBmOpSchema>;

export const PostBmIdBmOpnFaturaCmrObsSchema = z.discriminatedUnion("chave", [
  z.object({
    idBm: NewIdSql,
    op: NumeroInteiroMaiorQueZero,
    nFatutura: InteiroNaoNegativoSchema,
    chave: z.literal("cmr"),
    valor: z
      .string()
      .max(150, "O campo 'cmr' deve ter no máximo 150 caracteres."),
  }),
  z.object({
    idBm: NewIdSql,
    op: NumeroInteiroMaiorQueZero,
    nFatutura: InteiroNaoNegativoSchema,
    chave: z.literal("obs"),
    valor: z
      .string()
      .max(300, "O campo 'obs' deve ter no máximo 300 caracteres."),
  }),
]);

export type PostBmIdBmOpnFaturaCmrObsDto = z.infer<
  typeof PostBmIdBmOpnFaturaCmrObsSchema
>;

export const CmrOuObsSchema = (chave: "cmr" | "obs") =>
  StringComTamanhoSchema(chave === "cmr" ? 150 : 300);

export const PostBmIdBmOpnFaturaPesoLisquidoPesoBrutoSchema = z.object({
  idBm: NewIdSql,
  op: NumeroInteiroMaiorQueZero,
  nFatutura: InteiroNaoNegativoSchema,
  chave: z.enum(["pesoLiquido", "pesoBruto"]),
  valor: Numero,
});

export type PostBmIdBmOpnFaturaPesoLisquidoPesoBrutoDto = z.infer<
  typeof PostBmIdBmOpnFaturaPesoLisquidoPesoBrutoSchema
>;

export const IdBmOpEmTextoSchema = z.object({
  idBm: z.string(),
  op: z.string(),
});

export const BmAlteraNomeLoteFio = z.object({
  op: NumeroInteiro,
  idBm: z.string(),
  ref: z.string().length(18),
  refOrigem: z.string().length(18),
  texto: z.string().min(0).max(150),
});

export const PostDeDefeitosFio = z.object({
  op: z.string(),
  idBm: z.string(),
  ref: z.string().length(18),
  refOrigem: z.string().length(18),
  defeitosStock: NumeroOuZero,
});

export const IdBmBooleanAbreOuFecha = z.object({
  idBm: z.string(),
});

export const PostDeQuantidadeSeUnidade = z.object({
  op: z.string(),
  idBm: z.string(),
  ref: z.string().length(18),
  qtdeEntradaSeUnidade: Numero,
});
