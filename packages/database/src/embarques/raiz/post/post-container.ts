import { PostContainerSchemaDto } from "@repo/tipos/embarques";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const postContainerDb = async (
  container: PostContainerSchemaDto,
  ordem: number,
  nContainer: number
) => {
  const { idContainerPai, idEnvio, idTipoContainer } = container;
  return prismaEnvios.container.create({
    data: {
      idContainerPai,
      idEnvio,
      idTipoContainer,
      ordem,
      nContainer,
    },
  });
};
