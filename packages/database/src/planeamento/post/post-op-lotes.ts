import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postOpLotesDb = async (
  payload: string,
  userName: string,
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_op_post_lotes ${payload}, ${userName}
`;
