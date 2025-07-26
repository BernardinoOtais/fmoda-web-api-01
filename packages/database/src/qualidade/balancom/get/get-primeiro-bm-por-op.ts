import { OpDto } from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getPrimeiroBmPorOpDb = async (dados: OpDto) =>
  await prismaQualidade.bmOp.findFirst({
    where: dados,
    select: {
      op: true,
      Bm: { select: { fechado: true, idBm: true } },
    },
  });
