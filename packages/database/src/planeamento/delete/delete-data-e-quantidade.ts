import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const deleteDataEQuantidadeBd = async (
  op: number,
  tipoD: string,
  tipoQ: string,
  nTipo: number
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_planeamento_delete_DataEQtt ${op}, ${tipoD}, ${tipoQ}, ${nTipo}
`;
