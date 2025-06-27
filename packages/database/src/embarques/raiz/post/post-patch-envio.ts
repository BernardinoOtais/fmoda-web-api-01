import { prismaEnvios } from "@/prisma-servicos/envios/envios";
import { PostNovoEnvioSchemaDto } from "@repo/tipos/embarques";

export const posPatchEnvioBd = async (dados: PostNovoEnvioSchemaDto) => {
  const { idEnvio, nomeEnvio, idDestino, obs, nomeUser } = dados;

  return idEnvio
    ? await prismaEnvios.envio.update({
        where: { idEnvio },
        data: { nomeEnvio, idDestino, obs },
      })
    : nomeUser
      ? await prismaEnvios.envio.create({
          data: { nomeEnvio, idDestino, obs, nomeUser },
        })
      : "Erro ao validar Nome do utilizador";
};
