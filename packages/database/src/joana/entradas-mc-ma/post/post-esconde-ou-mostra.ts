import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

// 7 porque é bit para estampados e bordados

export const postEscondeMostraBordadosEstampadosBd = async (
  bostamp: string,
  userName: string,
) => {
  return await prismaQualidade.$queryRaw`
    exec FMO_PHC..fm_web_joana_post_upsert_bit_op ${bostamp}, 8,${userName}
  `;
};
