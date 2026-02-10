import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

// 9 porque é bit para Cortes

export const postEscondeMostraBordadosEstampadosBd = async (
  bostamp: string,
  userName: string,
) => {
  console.log(bostamp);
  console.log(userName);
  return await prismaQualidade.$queryRaw`
    exec FMO_PHC..fm_web_joana_post_upsert_bit_op ${bostamp}, 9,${userName}
  `;
};
