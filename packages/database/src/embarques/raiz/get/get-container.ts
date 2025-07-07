import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getContainerDb = async (idContainer: number) =>
  prismaEnvios.container.findUnique({
    where: {
      idContainer,
    },
  });
