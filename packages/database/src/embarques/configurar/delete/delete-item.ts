import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const deleteItemDb = async (idItem: number) => {
  return await prismaEnvios.$transaction(async (tx) => {
    await tx.itemTraduzido.deleteMany({
      where: { idItem },
    });

    await tx.acessorios.delete({
      where: { idItem },
    });

    await tx.item.delete({ where: { idItem } });
  });
};
