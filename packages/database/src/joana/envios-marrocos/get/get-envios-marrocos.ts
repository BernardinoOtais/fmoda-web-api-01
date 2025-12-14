import {
  EnviosMarrocosDto,
  EnviosMarrocosSchema,
} from "@repo/tipos/joana/enviosmarrocos";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getEnviosMarrocosDb = async (
  dataIni: Date | null,
  dataFini: Date | null,
  op: number | null
): Promise<EnviosMarrocosDto> => {
  const dados = await prismaQualidade.$queryRaw<EnviosMarrocosDto>`
    exec FMO_PHC..fm_web_joana_get_EnviosAMArrocos ${dataIni}, ${dataFini}, ${op}
  `;
  //console.log(dados);
  const dadosFinais = EnviosMarrocosSchema.parse(dados);
  return dadosFinais;
};
