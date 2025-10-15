import { format } from "date-fns";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const patchDePlaneamentoDataEQttDb = async (
  op: number,
  tipoD: string,
  tipoQ: string,
  nTipo: number,
  dataValue: Date,
  qtt: number
) => {
  const sqlDate = format(dataValue, "yyyy-MM-dd HH:mm:ss");

  return prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_planeamento_patch_DataEQttExistente ${op}, ${tipoD}, ${tipoQ}, ${nTipo}, ${sqlDate}, ${qtt}
`;
};
