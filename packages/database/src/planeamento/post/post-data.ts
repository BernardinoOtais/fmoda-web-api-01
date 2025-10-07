import { format } from "date-fns";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postDataDb = async (
  op: number,
  variavel: string,
  nData: number,
  data: Date
) => {
  const sqlDate = format(data, "yyyy-MM-dd HH:mm:ss");

  return prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_escreveDatasPlaneamento ${op}, ${variavel}, ${nData}, ${sqlDate}
`;
};
