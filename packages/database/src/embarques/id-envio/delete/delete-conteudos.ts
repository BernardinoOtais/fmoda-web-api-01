import { ListaIdsSchemaDto } from "@repo/tipos/embarques_idenvio";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";
/**
 * Deletes multiple "conteudo" records from the database whose IDs are specified in the provided list.
 *
 * @param idConteudos - An object containing an array of numbers representing the IDs of the "conteudo" records to delete.
 * @returns A promise that resolves to the result of the deleteMany operation.
 */
export const deleteConteudosDb = async (idConteudos: ListaIdsSchemaDto) =>
  await prismaEnvios.conteudo.deleteMany({
    where: {
      idConteudo: { in: idConteudos.numbers },
    },
  });
