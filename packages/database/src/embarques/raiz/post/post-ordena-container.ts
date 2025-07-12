import { IdOrdemDto, ListaDeContainersEnvioDto } from "@repo/tipos/embarques";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const postOrdenaContainerDb = async (
  ordemRecebida: IdOrdemDto
): Promise<ListaDeContainersEnvioDto> => {
  return await prismaEnvios.$transaction(async (tx) => {
    await Promise.all(
      ordemRecebida.idOrdem.map((item) =>
        tx.container.update({
          where: {
            idContainer: item.id,
          },
          data: { ordem: item.ordem },
        })
      )
    );

    const updatedContainers = await tx.container.findMany({
      where: {
        idContainer: { in: ordemRecebida.idOrdem.map((item) => item.id) },
      },
      orderBy: [{ idTipoContainer: "asc" }, { ordem: "asc" }],
    });

    const groupedContainers: Record<number, typeof updatedContainers> = {};

    updatedContainers.forEach((container) => {
      const { idTipoContainer } = container;
      (groupedContainers[idTipoContainer] ??= []).push(container);
    });

    await Promise.all(
      Object.values(groupedContainers).flatMap((group) =>
        group.map((container, index) =>
          tx.container.update({
            where: { idContainer: container.idContainer },
            data: { nContainer: index + 1 },
          })
        )
      )
    );

    return updatedContainers;
  });
};
