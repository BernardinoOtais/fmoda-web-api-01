import { prismaAuth } from "@/prisma-servicos/auth/auth";

export const patchPapeisDeUserDb = async (userId: string, papeis: string[]) => {
  if (!papeis.length) {
    await prismaAuth.userPapeis.deleteMany({ where: { userId } });
    return;
  }

  await prismaAuth.$transaction([
    prismaAuth.session.deleteMany({ where: { userId } }),
    prismaAuth.userPapeis.deleteMany({ where: { userId } }),
    prismaAuth.userPapeis.createMany({
      data: papeis.map((idPapel) => ({ userId, idPapel })),
    }),
  ]);
};
