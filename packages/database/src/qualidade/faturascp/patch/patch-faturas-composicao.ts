//fm_web_update_faturas_composicao_op

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const patchFaturasComposicaoOpBd = async (
  opStamp: string,
  composicao: string,
  userName: string,
) => {
  return await prismaQualidade.$queryRaw`
    exec FMO_PHC..fm_web_update_faturas_composicao_op ${opStamp}, ${composicao}, ${userName}
  `;
};
