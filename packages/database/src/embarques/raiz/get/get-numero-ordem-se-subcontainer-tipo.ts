import { prismaEnvios } from "@/prisma-servicos/envios/envios";
import { PostContainerSchemaDto } from "@repo/tipos/embarques";

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
