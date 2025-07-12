import { prismaAuth } from "@/prisma-servicos/auth/auth";

export const postPapeisDb = async (userId: string, papeis: string[]) => {
  await prismaAuth.userPapeis.createMany({
    data: papeis.map((idPapel) => ({
      userId,
      idPapel,
    })),
  });
};
