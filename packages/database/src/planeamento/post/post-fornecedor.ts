import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postFornecedorDb = async (
  fornecedor: string,
  op: string
) => prismaQualidade.$queryRaw`
  exec FMO_PHC..fm_escreveFornecedorPlaneamento ${op}, ${fornecedor}
`;
