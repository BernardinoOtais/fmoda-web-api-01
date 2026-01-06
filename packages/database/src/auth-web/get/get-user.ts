import { prismaAuth } from "@/prisma-servicos/auth/auth-client";

export const getUserDb = async (userId: string) =>
  prismaAuth.user.findUnique({
    where: { id: userId },
    select: {
      apelido: true,
      userPapeis: {
        select: { Papeis: { select: { descPapel: true } } },
        orderBy: {
          Papeis: {
            descPapel: "asc",
          },
        },
      },
    },
  });
