import {
  ContaCorrenteSDto,
  ContaCorrenteSchema,
} from "@repo/tipos/joana/contacorrente";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getContaCorrentDb = async (
  no: string,
): Promise<ContaCorrenteSDto | null> => {
  const dados = await prismaQualidade.$queryRaw<[]>`
    exec FMO_PHC..fm_web_get_conta_corrente ${no}
  `;

  //console.log(dados);
  const valores = ContaCorrenteSchema.safeParse(dados);

  if (!valores.success) {
    console.log(valores.error);
    return null;
  }

  return valores.data;
};
