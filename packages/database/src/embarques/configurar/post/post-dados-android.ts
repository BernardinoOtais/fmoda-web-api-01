import { prismaEnvios } from "@/prisma-servicos/envios/envios";
export const escrevoDadoPartesAndroid = async (
  dados: {
    idParte: number;
    descricaoParte: string;
    descricaoParteFrances: string;
  }[]
): Promise<void> => {
  await prismaEnvios.$transaction(async (tx) => {
    for (const d of dados) {
      const item = await tx.item.create({
        data: {
          Descricao: d.descricaoParte,
          inativo: false,
        },
      });

      await tx.ligacaoAndroid.create({
        data: {
          idParte: d.idParte,
          idItem: item.idItem,
        },
      });

      await tx.itemTraduzido.create({
        data: {
          idIdioma: 2, // 2 = French?
          idItem: item.idItem,
          descItem: d.descricaoParteFrances,
        },
      });
    }
  });
};
