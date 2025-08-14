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
      userPapeis: {
        where: { idPapel: "531854CA-3478-483E-98DE-DF5F463C8EE2" },
      },
    },
  });
//531854CA-3478-483E-98DE-DF5F463C8EE2 android
