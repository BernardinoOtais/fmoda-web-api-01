import { format } from "date-fns";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const upsertDataEValorDb = async (
  idDataQtt: number | null,
  bostamp: string,
  data: Date,
  nTipo: number,
  qtt: number,
  userName: string
) => {
  const sqlDate = format(data, "yyyy-MM-dd HH:mm:ss");
  await prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_planeamento_upsert_DataQtt ${idDataQtt}, ${bostamp}, ${sqlDate}, ${nTipo}, ${qtt}, ${userName}
`;
};
