import z from "zod";

import {
  FornecedorSchema,
  OpCamioesEnviosSchema,
} from "./get-op-camioes-envios";
import {
  GetPlaneamentoViaOrcamentoSchemaDef,
  PlaneamentoViaOrcamentoSchemaDef,
} from "./palneamento-via-orcamento";

import {
  ChavePhcSchema,
  DataEntreHojeEEUmAnoSchema,
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

// TypeScript type
export type OpCamioesEnvios = z.infer<typeof OpCamioesEnviosSchema>;

export const FornecedorSchemaParaUsar = FornecedorSchema;

export const PostFornecedorSchema = z.object({
  fornecedor: FornecedorSchema,
  op: NumeroInteiroMaiorQueZero,
});

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

export const DeleteDataEQttPlaneamentoSchema = z
  .object({
    op: NumeroInteiroMaiorQueZero,
    tipoD: z.enum(["u_datafor", "u_datacam"]),
    tipoQ: z.enum(["u_dfqtt", "u_camqtt"]),
    nTipo: NumeroInteiroMaiorQueZero,
  })
  .refine(
    (data) =>
      (data.tipoD === "u_datafor" && data.tipoQ === "u_dfqtt") ||
      (data.tipoD === "u_datacam" && data.tipoQ === "u_camqtt"),
    {
      message:
        "tipoQ deve corresponder ao tipoD (u_datafor → u_dfqtt, u_datacam → u_camqtt)",
      path: ["tipoQ"], // highlights the invalid field
    }
  );

export const PostDePlaneamentoDataEQttchema = z
  .object({
    op: NumeroInteiroMaiorQueZero,
    tipoD: z.enum(["u_datafor", "u_datacam"]),
    tipoQ: z.enum(["u_dfqtt", "u_camqtt"]),
    data: DateSchema,
    qtt: NumeroInteiro,
  })
  .refine(
    (data) =>
      (data.tipoD === "u_datafor" && data.tipoQ === "u_dfqtt") ||
      (data.tipoD === "u_datacam" && data.tipoQ === "u_camqtt"),
    {
      message:
        "tipoQ deve corresponder ao tipoD (u_datafor → u_dfqtt, u_datacam → u_camqtt)",
      path: ["tipoQ"], // highlights the invalid field
    }
  );

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

export const PatchtDePlaneamentoDataEQttchema = z
  .object({
    op: NumeroInteiroMaiorQueZero,
    tipoD: z.enum(["u_datafor", "u_datacam"]),
    tipoQ: z.enum(["u_dfqtt", "u_camqtt"]),
    nTipo: NumeroInteiroMaiorQueZero,
    data: DateSchema,
    qtt: NumeroInteiro,
  })
  .refine(
    (data) =>
      (data.tipoD === "u_datafor" && data.tipoQ === "u_dfqtt") ||
      (data.tipoD === "u_datacam" && data.tipoQ === "u_camqtt"),
    {
      message:
        "tipoQ deve corresponder ao tipoD (u_datafor → u_dfqtt, u_datacam → u_camqtt)",
      path: ["tipoQ"], // highlights the invalid field
    }
  );

export const PostObsSchema = z.object({
  bostamp: ChavePhcSchema,
  obs: StringComTamanhoSchema(100),
});
