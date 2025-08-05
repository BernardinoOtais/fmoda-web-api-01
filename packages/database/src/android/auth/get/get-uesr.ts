import { prismaAuth } from "@/prisma-servicos/auth/auth-client";

export const getUserDb = async (nomeUser: string) =>
  prismaAuth.user.findUnique({
    where: { username: nomeUser },
    select: {
      name: true,
      apelido: true,
      account: {
        where: { providerId: "credential" },
        select: { password: true },
      },
    },
  });
