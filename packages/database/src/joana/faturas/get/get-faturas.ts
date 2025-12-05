import { FaturacaoDto, FaturacaoSchema } from "@repo/tipos/joana/faturas";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getFaturasDb = async (
  dataIni: Date | null,
  dataFini: Date | null,
  op: number | null
): Promise<FaturacaoDto> => {
  const dados = await prismaQualidade.$queryRaw<FaturacaoDto[]>`
    exec FMO_PHC..fm_web_joana_get_Faturas ${dataIni}, ${dataFini}, ${op}
  `;

  const dadosFinais = FaturacaoSchema.parse(dados[0]);
  //console.log("datas : ", dataIni, dataFini);
  //console.log("dados: ", JSON.stringify(dadosFinais, null, 2));
  return dadosFinais;
};
