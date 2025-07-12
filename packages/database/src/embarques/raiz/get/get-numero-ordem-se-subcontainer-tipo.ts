import { PostContainerSchemaDto } from "@repo/tipos/embarques";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getNumeroDeOrdemSeSubContainerTipoDb = async (
  dados: PostContainerSchemaDto
) => {
  const { idContainerPai, idEnvio, idTipoContainer } = dados;
  return prismaEnvios.container.count({
    where: {
      idContainerPai,
      idEnvio,
      idTipoContainer,
    },
  });
};
