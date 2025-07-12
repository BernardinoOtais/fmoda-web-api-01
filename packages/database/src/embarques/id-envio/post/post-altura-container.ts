import { PostAlturaDto } from "@repo/tipos/embarques_idenvio";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const postAlturaContrainerDb = async (alturaRecebida: PostAlturaDto) =>
  await prismaEnvios.container.update({
    where: { idContainer: alturaRecebida.PostAltura.id },
    data: {
      altura:
        typeof alturaRecebida.PostAltura.altura === "string"
          ? parseFloat(alturaRecebida.PostAltura.altura)
          : alturaRecebida.PostAltura.altura,
    },
  });
