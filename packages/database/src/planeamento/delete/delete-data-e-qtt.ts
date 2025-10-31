//fm_web_planeamento_delete_DataQtt
//fm_web_planeamento_upsert_DataQtt

//@idDataQtt INT
import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const deleteDataEQttBd = async (
  idDataQtt: number,
  userName: string
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_planeamento_delete_DataQtt ${idDataQtt}, ${userName}
`;
