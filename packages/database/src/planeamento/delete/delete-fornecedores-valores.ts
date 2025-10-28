import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const deleteFornecedorValorizadoBd = async (
  idValorizado: number
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_planeamento_delete_DescValorizado ${idValorizado}
`;
