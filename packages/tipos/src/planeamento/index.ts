import z from "zod";

import {
  DataQttSchema,
  FornecedorSchema,
  FornecedorValorSchema,
  OpCamioesEnviosSchema,
} from "./get-op-camioes-envios";
import {
  GetPlaneamentoViaOrcamentoSchemaDef,
  PlaneamentoViaOrcamentoSchemaDef,
} from "./palneamento-via-orcamento";

import {
  ChavePhcSchema,
  DataEntreHojeEEUmAnoSchema,
  FloatSchema,
  NumeroInteiroMaiorQueZero,
  StringComTamanhoSchema,
} from "@/comuns";
import { DateSchema, NumeroInteiro } from "@/index";

export type { PlaneamentoLinha } from "./planeamentos-tipo";

export type {
  TabKey,
  Menu,
  PostPorOp,
  OpState,
  PlaneamentoState,
  PlaneamentoContextType,
} from "./alert-dialog-novo-planeamento";

export {
  MENUS_DISPONIVEIS,
  DEFAULT_TAB,
} from "./alert-dialog-novo-planeamento";

export type PlaneamentoOpsNaoPlaneadas = {
  id: string;
  op: string;
  modelo: string;
  descricao: string;
  pedido: string;
  corNome: string;
  quantidade: string;
  departamento: string;
  foto: string;
};

export type PlaneamentoPostOps = {
  op_chave: string;
  op: string;
  ref: string;
  modelo: string;
  descricao: string;
  pedido: string;
  corNome: string;
  quantidade: string;
  departamento: string;
  foto: string;
};

//Novo planeamento
export const GetPlaneamentosSchemas = z.object({
  enviado: z.boolean(),
  sub_contratado_id: ChavePhcSchema.optional(),
});

export const QantidadeOpSchema = NumeroInteiroMaiorQueZero;
export const OpSchema = NumeroInteiroMaiorQueZero;
export const PosNovoPlaneamentoSchema = z.object({
  idDestino: ChavePhcSchema,
  ops: z.array(
    z.object({
      op: NumeroInteiroMaiorQueZero,
    })
  ),
  maisQueUmaOP: z.boolean(),
});
//Novo planeamento

export type PosNovosPlaneamentosDto = z.infer<typeof PosNovoPlaneamentoSchema>;

//datas e camioes
// Schema for array results (from Prisma $queryRaw)
export const OpCamioesEnviosArraySchema = z.array(OpCamioesEnviosSchema);

//Fornecedor Preco
export type FornecedorValorDto = z.infer<typeof FornecedorValorSchema>;

export type DataQttSchema = z.infer<typeof DataQttSchema>;

// TypeScript type
export type OpCamioesEnvios = z.infer<typeof OpCamioesEnviosSchema>;

export const FornecedorSchemaParaUsar = FornecedorSchema;

export const PostDeDataSchema = z.object({
  op: NumeroInteiroMaiorQueZero,
  variavel: z.enum(["u_datafor", "u_datacam"]),
  nData: NumeroInteiroMaiorQueZero,
  data: DateSchema,
});

export const PostDeQttSchema = z.object({
  op: NumeroInteiroMaiorQueZero,
  variavel: z.enum(["u_dfqtt", "u_camqtt"]),
  nQtt: NumeroInteiroMaiorQueZero,
  qtt: NumeroInteiro,
});

export const DeleteFornecedorValorizadoSchema = z.object({
  idValorizado: NumeroInteiroMaiorQueZero,
});

export const DeleteDataEQttSchema = z.object({
  idDataQtt: NumeroInteiroMaiorQueZero,
});

//planeamento via op
export const GetPlaneamentoViaOrcamentoSchema =
  GetPlaneamentoViaOrcamentoSchemaDef;
export type PlaneamentoViaOrcamentoDto = z.infer<
  typeof PlaneamentoViaOrcamentoSchemaDef
>;

//planeamento via op

export const OpDatasNovoPlanemanetoSchema = z.object({
  date: DataEntreHojeEEUmAnoSchema,
  qtt: NumeroInteiro,
  n: NumeroInteiro.optional(),
});

export const PostObsSchema = z.object({
  bostamp: ChavePhcSchema,
  obs: StringComTamanhoSchema(100),
});

export const UpsertDescValorSchema = z.object({
  idValorizado: NumeroInteiroMaiorQueZero.nullable(),
  bostamp: ChavePhcSchema,
  nome: StringComTamanhoSchema(55),
  nTipo: z.union([z.literal(1)]), // ✅ Only allows 2 or 3 as numbers
  valorServico: FloatSchema,
});

export const UpsertDataQttSchema = z.object({
  idDataQtt: NumeroInteiroMaiorQueZero.nullable(),
  bostamp: ChavePhcSchema,
  data: DateSchema,
  nTipo: z.union([z.literal(2), z.literal(3)]),
  qtt: NumeroInteiro,
});
