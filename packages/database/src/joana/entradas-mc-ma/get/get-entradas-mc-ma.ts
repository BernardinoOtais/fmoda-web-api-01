import {
  MalhasEntradasMcMaListaSchema,
  MalhasEntradasMcMaDto,
} from "@repo/tipos/joana/emmcma";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getEntradasMcMaDb = async (
  op: number | null,
  veEscondidas: boolean | null,
): Promise<MalhasEntradasMcMaDto[]> => {
  const dados = await prismaQualidade.$queryRaw<MalhasEntradasMcMaDto[]>`
    exec FMO_PHC..fm_web_joana_get_EntradasMcMa ${op} , ${veEscondidas}
  `;
  /* const normalizados = dados.map((row) => ({
    ...row,
    pedido: Number(row.pedido),
    enviado: Number(row.enviado),
    recebido: Number(row.recebido),
  }));
*/
  const dadosFinais = MalhasEntradasMcMaListaSchema.parse(dados);
  return dadosFinais;
};
