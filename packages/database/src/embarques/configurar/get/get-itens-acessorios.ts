import { ItensAcessoriosDto } from "@repo/tipos/embarques_configurar";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getItensAcessoriosDb = async (): Promise<ItensAcessoriosDto> => {
  const [dados, idiomas] = await Promise.all([
    prismaEnvios.item.findMany({
      where: {
        Acessorios: {
          isNot: null,
        },
      },
      select: {
        idItem: true,
        Descricao: true,
        inativo: true,
        ItemTraduzido: {
          select: {
            idIdioma: true,
            descItem: true,
            Idiomas: { select: { nomeIdioma: true } },
          },
        },
        _count: { select: { Conteudo: true } },
      },
    }),
    prismaEnvios.idiomas.findMany(),
  ]);

  return {
    itemsSchema: dados,
    idiomasSchema: idiomas,
  };
};
