import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const patchFaturasPesoBd = async (
  ftstamp: string,
  u_pnet: string,
  u_pbruto: string,
  userName: string,
) => {
  return await prismaQualidade.$queryRaw`
    exec FMO_PHC..fm_web_update_faturas_pesos ${ftstamp}, ${u_pnet}, ${u_pbruto},${userName}
  `;
};
