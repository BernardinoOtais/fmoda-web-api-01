import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { EnviosListDto } from "@repo/tipos/embarques";

import { getNumeroEnviosEstadoDb } from "./get-numero-envios-estado";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getEnviosAcessoriosDb = async (
  dadosRecebidos: DadosParaPesquisaComPaginacaoEOrdemDto
): Promise<EnviosListDto> => {
  const { skip, take, fechado, ordem } = dadosRecebidos;

  const [dados, tamanhoLista] = await Promise.all([
    prismaEnvios.envio.findMany({
      where: { fechado: fechado },
      select: {
        idEnvio: true,
        nomeEnvio: true,
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
        fechado: true,
        createdAt: true,
        endDate: true,
        obs: true,
        nomeUser: true,
        _count: { select: { Container: true } },
      },
      skip,
      take,
      orderBy: { createdAt: ordem },
    }),
    getNumeroEnviosEstadoDb(fechado),
  ]);
  //await new Promise((resolve) => setTimeout(resolve, 5000));
  //throw new Error("Simulated error in development mode");
  return {
    lista: dados,
    tamanhoLista,
  };
};
