import {
  ChavePhcSchema,
  FloatZeroSchema,
  InteiroNaoNegativoSchema,
  StringComTamanhoSchema,
} from "@/comuns";
import { z } from "zod";

const ItemTraduzidoSchema = z.array(
  z.object({ descItem: StringComTamanhoSchema(100) })
);

export const UnidadeSchema = z.object({
  idUnidades: InteiroNaoNegativoSchema,
  idItem: InteiroNaoNegativoSchema,
  descricaoUnidade: StringComTamanhoSchema(100),
  Item: z.object({ ItemTraduzido: ItemTraduzidoSchema }).optional(),
});

export const OpTamanhoSchema = z.object({
  op: InteiroNaoNegativoSchema,
  tam: StringComTamanhoSchema(25),
  ordem: InteiroNaoNegativoSchema,
  qtt: InteiroNaoNegativoSchema,
});

const ItemSchema = z.object({
  idItem: InteiroNaoNegativoSchema,
  Descricao: StringComTamanhoSchema(100),
  ItemTraduzido: ItemTraduzidoSchema,
});

export const OpSchema = z.object({
  op: InteiroNaoNegativoSchema,
  ref: StringComTamanhoSchema(18),
  modeloDesc: StringComTamanhoSchema(60),
  modelo: StringComTamanhoSchema(50),
  cor: StringComTamanhoSchema(50),
  pedido: StringComTamanhoSchema(50),
  norma: StringComTamanhoSchema(50),
  OpTamanho: z.array(OpTamanhoSchema).optional(),
});

export const ConteudoSchema = z.object({
  idConteudo: InteiroNaoNegativoSchema,
  idContainer: InteiroNaoNegativoSchema,
  idItem: InteiroNaoNegativoSchema,
  Item: ItemSchema,
  op: InteiroNaoNegativoSchema,
  Op: OpSchema,
  tam: StringComTamanhoSchema(25),
  OpTamanho: z.object({ ordem: InteiroNaoNegativoSchema }),
  qtt: InteiroNaoNegativoSchema,
  Unidades: UnidadeSchema,
  peso: InteiroNaoNegativoSchema,
});

export const ContainerOpSchema = z.object({
  op: InteiroNaoNegativoSchema,
  Op: OpSchema,
});

export const DestinoEnvioSchema = z.object({
  idDestino: ChavePhcSchema,
  idIdioma: InteiroNaoNegativoSchema,
  nomeDestino: StringComTamanhoSchema(60),
  morada: StringComTamanhoSchema(55),
  localMorada: StringComTamanhoSchema(43),
  codigoPostal: StringComTamanhoSchema(45),
  nacionalidade: StringComTamanhoSchema(20),
});
export const ContainerOpsSchemas = z.array(ContainerOpSchema).optional();

export const TipoContainerSchema = z
  .object({
    idItem: InteiroNaoNegativoSchema,
    Item: z.object({
      Descricao: StringComTamanhoSchema(100),
    }),
  })
  .optional();

export const BaseContainerSchema = z.object({
  idContainer: InteiroNaoNegativoSchema,
  idContainerPai: InteiroNaoNegativoSchema.nullable(),
  idTipoContainer: InteiroNaoNegativoSchema,
  ordem: InteiroNaoNegativoSchema,
  nContainer: InteiroNaoNegativoSchema,
  altura: FloatZeroSchema,
  TipoContainer: TipoContainerSchema,
  ContainerOp: ContainerOpsSchemas,
  Conteudo: z.array(ConteudoSchema).optional(),
});

type ContainerSchema = z.infer<typeof BaseContainerSchema> & {
  other_Container?: ContainerSchema[];
};

export const ContainerEnvioSchema: z.ZodType<ContainerSchema> =
  BaseContainerSchema.extend({
    other_Container: z.lazy(() => ContainerEnvioSchema.array()).optional(),
  });

const ListaDeContainersEnvioSchema = z.array(ContainerEnvioSchema).optional();

const ItensSchema = z.array(
  z.object({
    idItem: InteiroNaoNegativoSchema,
    Descricao: StringComTamanhoSchema(100),
  })
);

export const DestinosPossiveisSchema = z.array(
  z.object({
    value: ChavePhcSchema,
    label: StringComTamanhoSchema(100),
  })
);
const UnidadesSchema = z.array(UnidadeSchema);

export const EnvioSchema = z.object({
  idEnvio: InteiroNaoNegativoSchema,
  nomeEnvio: StringComTamanhoSchema(50),
  Destinos: DestinoEnvioSchema,
  fechado: z.boolean().default(false),
  createdAt: z.coerce.date().default(new Date()),
  endDate: z.coerce
    .date()
    .nullable()
    .optional()
    .transform((val) => val ?? null),
  obs: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val ?? null),
  nomeUser: StringComTamanhoSchema(100),
  _count: z.object({ Container: InteiroNaoNegativoSchema }).optional(),
  Container: ListaDeContainersEnvioSchema,
  Itens: ItensSchema.optional(),
  Unidades: UnidadesSchema.optional(),
  DestinosDisponiveis: DestinosPossiveisSchema.optional(),
});

export const EnviosListSchema = z.object({
  lista: z.array(EnvioSchema),
  tamanhoLista: InteiroNaoNegativoSchema,
});

export type EnviosListDto = z.infer<typeof EnviosListSchema>;
