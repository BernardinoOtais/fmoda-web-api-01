import {
  ChavePhcSchema,
  FloatZeroSchema,
  InteiroNaoNegativoSchema,
  StringComTamanhoSchema,
} from "@/comuns";
import { z } from "zod";

const tamanhosQttPeso = z.object({
  tam: z.string().max(25, { message: "Máximo 25 caracteres" }),
  qtt: FloatZeroSchema,
  peso: FloatZeroSchema,
  pesoUnit: FloatZeroSchema,
});

export const PostConteudoSchema = z.object({
  idEnvio: InteiroNaoNegativoSchema,
  conteudo: z.object({
    idContainer: InteiroNaoNegativoSchema,
    idItem: InteiroNaoNegativoSchema,
    op: InteiroNaoNegativoSchema,
    idUnidades: InteiroNaoNegativoSchema,
    TamanhosQttPeso: z.array(tamanhosQttPeso),
  }),
});

export type PostConteudoDto = z.infer<typeof PostConteudoSchema>;

export const OpTamanhoSchema = z.object({
  op: InteiroNaoNegativoSchema,
  tam: StringComTamanhoSchema(25),
  ordem: InteiroNaoNegativoSchema,
  qtt: InteiroNaoNegativoSchema,
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

export const ContainerOpSchema = z.object({
  op: InteiroNaoNegativoSchema,
  Op: OpSchema,
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

export const ContainerSchema = z.object({
  idContainer: InteiroNaoNegativoSchema,
  idContainerPai: InteiroNaoNegativoSchema.nullable(),
  idTipoContainer: InteiroNaoNegativoSchema,
  ordem: InteiroNaoNegativoSchema,
  nContainer: InteiroNaoNegativoSchema,
  altura: FloatZeroSchema,
  TipoContainer: TipoContainerSchema,
  ContainerOp: ContainerOpsSchemas,
  _count: z.object({
    other_Container: InteiroNaoNegativoSchema,
    Conteudo: InteiroNaoNegativoSchema,
  }),
});

export const ListaContainersETipoPaiSchema = z.object({
  containers: z.array(ContainerSchema),
  idTipoContainer: InteiroNaoNegativoSchema.optional(),
});

export type ListaContainersETipoPaiDto = z.infer<
  typeof ListaContainersETipoPaiSchema
>;

//destino
export const PostDestinoSchema = z.object({
  idEnvio: InteiroNaoNegativoSchema,
  idDestino: ChavePhcSchema,
});

export type PostDestinoSchemaDto = z.infer<typeof PostDestinoSchema>;
//destinos

//Mais destinos container-conteudo-footer-wrapper
export const DestinoEnvioSchema = z.object({
  idDestino: ChavePhcSchema,
  idIdioma: InteiroNaoNegativoSchema,
  nomeDestino: StringComTamanhoSchema(60),
  morada: StringComTamanhoSchema(55),
  localMorada: StringComTamanhoSchema(43),
  codigoPostal: StringComTamanhoSchema(45),
  nacionalidade: StringComTamanhoSchema(20),
});
export type DestinoEnvioDto = z.infer<typeof DestinoEnvioSchema>;

//Mais destinos container-conteudo-footer-wrapper

const ListaContainersSchema = z.array(ContainerSchema);
export type ListaContainersDto = z.infer<typeof ListaContainersSchema>;

const ItemTraduzidoSchema = z.array(
  z.object({ descItem: StringComTamanhoSchema(100) })
);

const ItemSchema = z.object({
  idItem: InteiroNaoNegativoSchema,
  Descricao: StringComTamanhoSchema(100),
  ItemTraduzido: ItemTraduzidoSchema,
});

export const UnidadeSchema = z.object({
  idUnidades: InteiroNaoNegativoSchema,
  idItem: InteiroNaoNegativoSchema,
  descricaoUnidade: StringComTamanhoSchema(100),
  Item: z.object({ ItemTraduzido: ItemTraduzidoSchema }).optional(),
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

export type ContainerSchemaDto = z.infer<typeof ContainerEnvioSchema>;

export type ContainerDto = z.infer<typeof ContainerSchema>;

export const PostAlturaSchema = z.object({
  PostAltura: z.object({
    id: InteiroNaoNegativoSchema,
    altura: FloatZeroSchema,
  }),
});

export type PostAlturaDto = z.infer<typeof PostAlturaSchema>;

export const IdOpSchema = z.object({
  id: InteiroNaoNegativoSchema,
  op: InteiroNaoNegativoSchema,
});
export type IdOpSchemaDto = z.infer<typeof IdOpSchema>;
export const PostOpSchema = z.object({
  PostOp: IdOpSchema,
});
export type PostOpDto = z.infer<typeof PostOpSchema>;

//imprimir
export const ConteudoImprimirSchema = z.object({
  idItem: InteiroNaoNegativoSchema,
  idConteudo: InteiroNaoNegativoSchema,
  Descricao: StringComTamanhoSchema(100),
  op: InteiroNaoNegativoSchema,
  modelo: StringComTamanhoSchema(50),
  modeloDesc: StringComTamanhoSchema(60),
  cor: StringComTamanhoSchema(50),
  pedido: StringComTamanhoSchema(50),
  norma: StringComTamanhoSchema(50),
  tam: StringComTamanhoSchema(25),
  qtt: InteiroNaoNegativoSchema,
  descUnidade: StringComTamanhoSchema(100),
  peso: InteiroNaoNegativoSchema,
});
export const BaseContainerPrintSchema = z
  .object({
    Descricao: StringComTamanhoSchema(100),
    idContainer: InteiroNaoNegativoSchema,
    idTipoContainer: InteiroNaoNegativoSchema,
    nContainer: InteiroNaoNegativoSchema,
    ordem: InteiroNaoNegativoSchema,
    altura: FloatZeroSchema,
    conteudo: z.array(ConteudoImprimirSchema).optional(),
  })
  .partial();

type ContainerPrintSchema = z.infer<typeof BaseContainerPrintSchema> & {
  subContainer?: ContainerPrintSchema[];
};

export const ContainerPrintLazySchema: z.ZodType<ContainerPrintSchema> =
  BaseContainerPrintSchema.extend({
    subContainer: z.lazy(() => ContainerPrintLazySchema.array()).optional(),
  });

export const ListaParaImprimrirSchema = z.array(ContainerPrintLazySchema);
export type ListaParaImprimrirDto = z.infer<typeof ListaParaImprimrirSchema>;
export type ConteudoImprimirDto = z.infer<typeof ConteudoImprimirSchema>;

//imprimir

export const IdEnvioIdContainerSchema = z.object({
  idEnvio: InteiroNaoNegativoSchema,
  idContainer: InteiroNaoNegativoSchema.optional(),
});

export const ListaContudoSchema = z.array(ConteudoSchema);
export type ListaContudoDto = z.infer<typeof ListaContudoSchema>;
export type ContainerOpsSchemasDto = z.infer<typeof ContainerOpsSchemas>;

export type OpSchemaDto = z.infer<typeof OpSchema>;

export const ListaIdsSchema = z.object({
  idEnvio: InteiroNaoNegativoSchema,
  numbers: z.array(InteiroNaoNegativoSchema),
});

export type ListaIdsSchemaDto = z.infer<typeof ListaIdsSchema>;
