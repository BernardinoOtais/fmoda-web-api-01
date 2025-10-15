import { PlaneamentoViaOrcamentoDto } from "@repo/tipos/planeamento";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

type Schema = PlaneamentoViaOrcamentoDto[];
export const getPlaneamentoViaOrcamentoDb = async (
  ano: number,
  nFicha: number
) => prismaQualidade.$queryRaw<Schema>`
  exec FMO_PHC..fm_web_planeamento_get_ViaOrcamento ${ano}, ${nFicha}
`;
