import {
  NaoRegularizadoDto,
  NaoRegularizadoSchema,
} from "@repo/tipos/joana/naoregularizada";
import z from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getNaoRegularizadoDb = async (
  no: string,
): Promise<NaoRegularizadoDto | null> => {
  const dados = await prismaQualidade.$queryRaw<[]>`
    exec FMO_PHC..fm_web_get_nao_regularizado ${no}
  `;

  //console.log(dados);
  const valores = NaoRegularizadoSchema.safeParse(dados);

  if (!valores.success) {
    console.log(valores.error);
    return null;
  }

  return valores.data;
};
