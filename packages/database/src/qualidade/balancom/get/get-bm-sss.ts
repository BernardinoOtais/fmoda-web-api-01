import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { BmSchemas } from "@repo/tipos/qualidade_balancom";

import { getNumeroBms } from "./get-numero-bss";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getBmSssBd = async ({
  skip,
  take,
  fechado,
  ordem,
}: DadosParaPesquisaComPaginacaoEOrdemDto) => {
  const [bms, totalCount] = await Promise.all([
    prismaQualidade.bm
      .findMany({
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
      })
      .then((raw) => BmSchemas.parse(raw)),

    getNumeroBms(fechado),
  ]);

  return {
    lista: bms,
    tamanhoLista: totalCount,
  };
};
