import { PatchItemSchemaDto } from "@repo/tipos/embarques_configurar";
import { prismaEnvios } from "@/prisma-servicos/envios/envios";
export const patchNomeItemDb = async (dados: PatchItemSchemaDto) => {
  const { idItem, idIdioma, Descricao, descItem } = dados;
  return await prismaEnvios.$transaction(async (tx) => {
    await tx.item.update({ where: { idItem }, data: { Descricao } });
    await tx.itemTraduzido.update({
      where: { idIdioma_idItem: { idItem, idIdioma } },
      data: { descItem },
    });
  });
};
