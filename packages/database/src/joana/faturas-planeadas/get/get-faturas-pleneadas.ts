import {
  FaturasPlaneadasDto,
  FaturasPlaneadasSchema,
} from "@repo/tipos/joana/faturasplan";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getFaturasPlaneadasDb = async (
  dataIni: Date | null,
  dataFini: Date | null,
  fornecedor: string | null
): Promise<FaturasPlaneadasDto> => {
  const dados = await prismaQualidade.$queryRaw<FaturasPlaneadasDto[]>`
    exec FMO_PHC..fm_web_joana_get_FaturasPlaneadas ${dataIni}, ${dataFini}, ${fornecedor}
  `;
  const dadosFinais = FaturasPlaneadasSchema.parse(dados[0]);
  return dadosFinais;
};
