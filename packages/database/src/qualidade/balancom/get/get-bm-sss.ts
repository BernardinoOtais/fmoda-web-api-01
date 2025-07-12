import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getBmSssBd = async ({
  skip,
  take,
  fechado,
  ordem,
}: DadosParaPesquisaComPaginacaoEOrdemDto) =>
  prismaQualidade.bm.findMany({
    where: { fechado },
    include: {
      BmMalhas: {
        include: {
          BmOpsPorMalha: {
            include: {
              BmMovimentosLotes: true,
            },
          },
        },
      },
      BmOp: {
        include: {
          BmOpFaturado: {
            orderBy: { fData: "asc" },
          },
        },
      },
      BmTc: true,
    },
    skip,
    take,
    orderBy: { CreatedAt: ordem },
  });
