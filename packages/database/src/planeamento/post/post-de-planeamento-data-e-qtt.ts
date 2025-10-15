import { format } from "date-fns";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postDePlaneamentoDataEQttDb = async (
  op: number,
  tipoD: string,
  tipoQ: string,
  dataValue: Date,
  qtt: number
) => {
  const sqlDate = format(dataValue, "yyyy-MM-dd HH:mm:ss");

  return prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_planeamento_post_novaDataEQtt ${op}, ${tipoD}, ${tipoQ}, ${sqlDate}, ${qtt}
`;
};
