import { PostContainerSchemaDto } from "@repo/tipos/embarques";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

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
