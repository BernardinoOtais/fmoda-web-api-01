import { GetLotesDto, GetLotesSchema } from "@repo/tipos/planeamento/lotes";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getOpLotesDistDb = async (
  Obrano: number,
  CaseCapacity: number,
  MaxSizesPerCase: number,
) => {
  const dados = await prismaQualidade.$queryRaw<GetLotesDto[]>`
        exec FMO_PHC..fm_web_op_get_distVDois ${Obrano}, ${CaseCapacity}, ${MaxSizesPerCase} 
      `;

  const dadosFinais = GetLotesSchema.parse(dados[0]);
  return dadosFinais;
};
