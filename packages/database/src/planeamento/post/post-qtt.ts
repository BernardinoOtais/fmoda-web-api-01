import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postQttDb = async (
  op: number,
  variavel: string,
  nQtt: number,
  qtt: number
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_escreveQttsPlaneamento ${op}, ${variavel}, ${nQtt}, ${qtt}
`;
