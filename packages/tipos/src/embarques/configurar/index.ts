import { InteiroNaoNegativoSchema, StringComTamanhoSchema } from "@/comuns";
import { z } from "zod";

const IdiomasSchema = z.object({
  idIdioma: InteiroNaoNegativoSchema,
  nomeIdioma: StringComTamanhoSchema(50),
});

const ItemTraduzidoSchema = z.object({
  idIdioma: InteiroNaoNegativoSchema,
  descItem: StringComTamanhoSchema(100),
  Idiomas: z.object({
    nomeIdioma: StringComTamanhoSchema(50),
  }),
});

const ItemSchema = z.object({
  idItem: InteiroNaoNegativoSchema,
  Descricao: StringComTamanhoSchema(100),
  inativo: z.boolean(),
  ItemTraduzido: z.array(ItemTraduzidoSchema),
  _count: z.object({
    Conteudo: InteiroNaoNegativoSchema,
  }),
});
const ItemsSchema = z.array(ItemSchema);

export const ItensAcessoriosSchema = z.object({
  itemsSchema: ItemsSchema,
  idiomasSchema: z.array(IdiomasSchema),
});

export const PatchItemSchema = z.object({
  idItem: InteiroNaoNegativoSchema,
  idIdioma: InteiroNaoNegativoSchema,
  Descricao: StringComTamanhoSchema(100, 5),
  descItem: StringComTamanhoSchema(100, 5),
});
export type PatchItemSchemaDto = z.infer<typeof PatchItemSchema>;

export type ItensAcessoriosDto = z.infer<typeof ItensAcessoriosSchema>;
