import { prismaAuth } from "@/prisma-servicos/auth/auth";

export const getUserPapeisDb = async (name: string) =>
  prismaAuth.user.findMany({
    where: {
      name: {
        contains: name, // generates LIKE '%john%'
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      userPapeis: {
        select: {
          idPapel: true,
        },
      },
    },
  });
