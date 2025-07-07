import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getContainerOpDb = async (idContainer: number, op: number) =>
  await prismaEnvios.containerOp.findUnique({
    where: {
      idContainer_op: {
        idContainer,
        op,
      },
    },
  });
