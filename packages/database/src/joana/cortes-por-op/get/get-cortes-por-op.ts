import {
  FornecedoresCortesDto,
  FornecedoresCortesSchema,
} from "@repo/tipos/joana/corteporop";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getCortesPorOpDb = async (
  op: number | null
): Promise<FornecedoresCortesDto> => {
  const dados = await prismaQualidade.$queryRaw<FornecedoresCortesDto[]>`
    exec FMO_PHC..fm_web_joana_get_CortesOp ${op}
  `;

  //console.log(dados);
  const dadosFinais = FornecedoresCortesSchema.parse(dados);
  return dadosFinais;
};
