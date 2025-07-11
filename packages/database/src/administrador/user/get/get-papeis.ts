import { prismaAuth } from "@/prisma-servicos/auth/auth";

export const getPapeisDb = async () => {
  const papeisDb = await prismaAuth.papeis.findMany();

  return {
    papeis: papeisDb.map((papel) => ({
      idPapel: papel.idPapel,
      descricao: papel.descPapel,
    })),
  };
};
