import { PostItensAcessoriosSchemaDto } from "@repo/tipos/embarques_configurar";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const insiroItensDB = async (
  dadosRecebidos: PostItensAcessoriosSchemaDto
) => {
  const dados = dadosRecebidos.itens;
  await prismaEnvios.$transaction(async (tx) => {
    const promises = [];

    for (const item of dados) {
      if (!item.Descricao || !item.idiomas?.length) {
        continue;
      }

      const itemComAMesmaDescricao = await tx.item.findFirst({
        where: {
          Descricao: item.Descricao,
          Acessorios: { isNot: null },
        },
      });

      if (itemComAMesmaDescricao) {
        // Process translations for existing item
        promises.push(
          ...item.idiomas.map((idioma) =>
            tx.itemTraduzido.upsert({
              where: {
                idIdioma_idItem: {
                  idItem: itemComAMesmaDescricao.idItem,
                  idIdioma: idioma.idIdioma,
                },
              },
              update: { descItem: idioma.descItem },
              create: {
                idIdioma: idioma.idIdioma,
                idItem: itemComAMesmaDescricao.idItem,
                descItem: idioma.descItem,
              },
            })
          )
        );

        // If translation already exists, update and exit loop
        for (const idioma of item.idiomas) {
          const itemComAMesmaTraducao = await tx.itemTraduzido.findFirst({
            where: {
              idIdioma: idioma.idIdioma,
              descItem: idioma.descItem,
            },
          });
          if (itemComAMesmaTraducao) {
            promises.push(
              tx.item.update({
                where: { idItem: itemComAMesmaTraducao.idItem },
                data: { Descricao: item.Descricao, inativo: false },
              })
            );
            break; // Exit after first valid update
          }
        }
        continue; // Skip new item creation
      }

      // Create new item & translations
      const novoItem = await tx.item.create({
        data: { Descricao: item.Descricao, inativo: false },
      });

      await tx.acessorios.create({
        data: { idItem: novoItem.idItem, Descricao: novoItem.Descricao },
      });

      promises.push(
        tx.itemTraduzido.createMany({
          data: item.idiomas.map((idioma) => ({
            idItem: novoItem.idItem,
            idIdioma: idioma.idIdioma,
            descItem: idioma.descItem,
          })),
        })
      );
    }

    await Promise.all(promises);
  });
};
