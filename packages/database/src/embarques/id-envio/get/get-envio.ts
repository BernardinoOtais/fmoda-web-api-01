import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getEnvioDb = async ({ id }: IdNumeroInteiroNaoNegativoDto) => {
  return prismaEnvios.envio.findUnique({
    where: {
      idEnvio: id,
    },
    select: {
      idEnvio: true,
      nomeEnvio: true,
      obs: true,
      Destinos: {
        select: {
          idDestino: true,
          idIdioma: true,
          nomeDestino: true,
          morada: true,
          localMorada: true,
          codigoPostal: true,
          nacionalidade: true,
        },
      },
    },
  });
};
