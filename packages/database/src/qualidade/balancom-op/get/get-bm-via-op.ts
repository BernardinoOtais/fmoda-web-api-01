import { OpDto } from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getBmViaOpBd = async (op: OpDto) => {
  const dados = await prismaQualidade.bmOp.findFirst({
    where: op,
    select: { idBm: true },
  });

  if (!dados) return null;

  const idBm = dados.idBm;

  return await prismaQualidade.bm.findUnique({
    where: { idBm },
  });
};
