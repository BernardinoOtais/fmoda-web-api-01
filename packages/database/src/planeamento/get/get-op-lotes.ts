import { OpDto, OpSchema } from "@repo/tipos/planeamento/lotes";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getOpLotesDb = async (op: number) => {
  const dados = await prismaQualidade.$queryRaw<OpDto[]>`
        exec FMO_PHC..fm_web_op_pedido ${op} 
      `;

  const dadosFinais = OpSchema.parse(dados[0]);
  return dadosFinais;
};
