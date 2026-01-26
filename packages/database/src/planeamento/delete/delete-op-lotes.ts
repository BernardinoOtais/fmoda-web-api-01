import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const deleteOpLotesBd = async (
  idLote: number,
  bostamp: string,
  ref: string,
  userName: string,
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_op_delete_lotes ${idLote}, ${bostamp}, ${ref}, ${userName}
`;
