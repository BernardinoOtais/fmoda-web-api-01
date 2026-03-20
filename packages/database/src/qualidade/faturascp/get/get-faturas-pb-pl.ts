import { FaturasComposicaoPbEPl } from "@repo/tipos/qualidade/faturascp";
import z from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

type dadosRecebidos = z.infer<typeof FaturasComposicaoPbEPl>;

export const getBFaturasPbPlBd = async (
  ano: string,
  fatura: string,
): Promise<dadosRecebidos> => {
  const dados = await prismaQualidade.$queryRaw<dadosRecebidos[]>`
    exec FMO_PHC..fm_web_get_fatura_para_alterar_composicao_e_pb_pl ${ano}, ${fatura}
    `;

  //console.log("dados :::", dados);
  const resultadoFinal = FaturasComposicaoPbEPl.parse(dados[0]);
  return resultadoFinal;
};
