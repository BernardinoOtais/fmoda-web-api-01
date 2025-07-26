import { BmMalhasOpsSchema } from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getBmDataViaIdBd = async (idBm: string) => {
  const bmMalhasPromise = prismaQualidade.bmMalhas.findMany({
    where: { idBm },
    include: {
      BmOpsPorMalha: {
        include: {
          BmMovimentosLotes: true,
        },
      },
      BmMalhasFio: {
        include: {
          BmOpsPorMalhaFio: {
            include: {
              BmMalhasFioMovimentos: true,
            },
          },
        },
      },
    },
  });

  const bmOpPromise = prismaQualidade.bmOp.findMany({
    where: { idBm },
    include: {
      BmOpFaturado: {
        orderBy: { fData: "asc" },
      },
    },
  });

  const composicao = prismaQualidade.bm.findUnique({
    where: { idBm },
    select: { composicao: true },
  });

  const [BmMalhas, BmOp, Composicao] = await Promise.all([
    bmMalhasPromise,
    bmOpPromise,
    composicao,
  ]);

  const dados = BmMalhasOpsSchema.parse({ BmMalhas, BmOp, Composicao });
  return dados;
};
