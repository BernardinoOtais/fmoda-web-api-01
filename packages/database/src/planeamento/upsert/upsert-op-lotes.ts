import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const upsertOpLotesDb = async (
  bostamp: string,
  numeroPecaCaixa: number,
  qttTamanhosAJuntar: number,
  userName: string | null,
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_op_usert_lotes_upsert_qtts ${bostamp}, ${numeroPecaCaixa}, ${qttTamanhosAJuntar}, ${userName}
`;
