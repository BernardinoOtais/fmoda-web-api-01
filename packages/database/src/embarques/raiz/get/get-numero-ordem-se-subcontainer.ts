import { prismaEnvios } from "@/prisma-servicos/envios/envios";
import { PostContainerSchemaDto } from "@repo/tipos/embarques";

export const getNumeroDeOrdemSeSubContainerDb = async (
  dados: PostContainerSchemaDto
) => {
  const { idContainerPai, idEnvio } = dados;
  return prismaEnvios.container.count({
    where: {
      idContainerPai,
      idEnvio,
    },
  });
};
