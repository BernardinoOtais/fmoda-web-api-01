import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const deleteContainerOpsByOpDb = async (
  containers: number[],
  op: number
) =>
  await prismaEnvios.$transaction(async (tx) => {
    await tx.containerOp.deleteMany({
      where: {
        idContainer: { in: containers },
        op,
      },
    });
  });
