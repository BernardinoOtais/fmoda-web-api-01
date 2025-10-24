import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postObsDb = async (
  bostamp: string,
  obs: string
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_planeamento_AlteraObs ${bostamp}, ${obs}
`;
