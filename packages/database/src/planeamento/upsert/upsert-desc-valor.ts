import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const upsertDescValorDb = async (
  idValorizado: number | null,
  bostamp: string,
  nome: string,
  nTipo: number,
  valorServico: number,
  userName: string
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_web_planeamento_upsert_DescValorizado ${idValorizado}, ${bostamp}, ${nome}, ${nTipo}, ${valorServico}, ${userName}
`;
