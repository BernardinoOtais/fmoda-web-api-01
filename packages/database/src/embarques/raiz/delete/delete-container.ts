import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const deleteConatinerDb = async (idContainer: number) => {
  await prismaEnvios.$transaction(async (tx) => {
    await tx.containerOp.deleteMany({
      where: { idContainer },
    });

    // Delete the container
    const containerApagado = await tx.container.delete({
      where: { idContainer },
    });

    // Adjust the "ordem" of remaining containers
    const { idContainerPai, idTipoContainer, ordem, idEnvio, nContainer } =
      containerApagado;

    await tx.container.updateMany({
      where: {
        idEnvio: containerApagado.idEnvio,
        idContainerPai,
        ordem: { gt: ordem },
      },
      data: {
        ordem: {
          decrement: 1,
        },
      },
    });

    await tx.container.updateMany({
      where: {
        idEnvio,
        idContainerPai,
        idTipoContainer,
        nContainer: { gt: nContainer },
      },
      data: {
        nContainer: {
          decrement: 1,
        },
      },
    });
  });
};
