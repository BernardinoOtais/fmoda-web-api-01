import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const postManyContainerOpDb = async (
  data: { idContainer: number; op: number }[]
) =>
  await prismaEnvios.$transaction(async (tx) => {
    await tx.containerOp.createMany({
      data,
    });
  });
