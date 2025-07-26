import { PostDeComposicao } from "@repo/tipos/qualidade_balancom_composicao";
import { z } from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export async function postBmNovoOuAlteroComposicaoBd(
  value: z.infer<typeof PostDeComposicao>
) {
  const { idBm, ref, idComposicao, qtt } = value;

  await prismaQualidade.bmIdBmComposicao.upsert({
    where: { idBm_ref_idComposicao: { idBm, ref, idComposicao } },
    update: { qtt },
    create: {
      idBm,
      ref,
      idComposicao,
      qtt,
    },
  });
  return "ok";
}
