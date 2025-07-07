import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getTodosContainersIdContainerDb = async (
  idContainer: number
): Promise<number[]> => {
  const container = await prismaEnvios.container.findUnique({
    where: { idContainer },
    include: {
      other_Container: true,
    },
  });

  if (!container) {
    return [];
  }

  const childIds = await Promise.all(
    container.other_Container.map(async (child) =>
      getTodosContainersIdContainerDb(child.idContainer)
    )
  );

  return [idContainer, ...childIds.flat()];
};
