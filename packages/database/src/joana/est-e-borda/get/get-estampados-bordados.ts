import {
  EstampadosEBordadosSchema,
  EstampadosEBordadosDto,
} from "@repo/tipos/joana/esteborda";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getEstampadosBordadosDb =
  async (): Promise<EstampadosEBordadosDto> => {
    const dados = await prismaQualidade.$queryRaw<EstampadosEBordadosDto>`
    exec FMO_PHC..fm_web_joana_get_EstampariaBordados
  `;

    const dadosFinais = EstampadosEBordadosSchema.parse(dados);
    return dadosFinais;
  };
