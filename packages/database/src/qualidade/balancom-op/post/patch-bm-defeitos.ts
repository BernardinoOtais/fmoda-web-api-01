import {
  PostDeDefeitosDto,
  ReturnPostDeDefeitosSchema,
} from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const patchBmDefeitosBd = async (dados: PostDeDefeitosDto) => {
  const resultado = await prismaQualidade.bmMalhas.update({
    where: {
      idBm_ref: { idBm: dados.idBm, ref: dados.ref },
    },
    data: { defeitosStock: dados.defeitosStock },
  });

  return ReturnPostDeDefeitosSchema.parse({
    idBm: resultado.idBm,
    ref: resultado.ref,
    defeitosStock: resultado.defeitosStock,
  });
};
