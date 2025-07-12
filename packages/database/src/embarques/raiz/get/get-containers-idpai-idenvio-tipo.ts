import { PostContainerSchemaDto } from "@repo/tipos/embarques";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getContainersidPaiidEnvioTipodb = (
  container: PostContainerSchemaDto
) => {
  const { idContainerPai, idEnvio, idTipoContainer } = container;
  return prismaEnvios.container.findMany({
    where: {
      idContainerPai,
      idEnvio,
      idTipoContainer,
    },
  });
};
