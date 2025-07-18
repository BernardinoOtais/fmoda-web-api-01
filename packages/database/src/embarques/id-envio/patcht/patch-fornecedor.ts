import { PostDestinoSchemaDto } from "@repo/tipos/embarques_idenvio";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const patchFornecedorDb = async (
  destinoRecebido: PostDestinoSchemaDto
) => {
  const { idEnvio, idDestino } = destinoRecebido;

  const resutado = await prismaEnvios.$transaction(async (tx) => {
    return await tx.envio.update({
      where: { idEnvio },
      data: { idDestino },
    });
  });

  return { idEnvio: resutado.idEnvio, idDestino: resutado.idDestino };
};
