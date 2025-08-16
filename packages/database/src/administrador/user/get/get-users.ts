import { prismaAuth } from "@/prisma-servicos/auth/auth";

export const getUsersDb = async (): Promise<
  { value: string; label: string }[]
> => {
  const users = await prismaAuth.user.findMany({
    select: { id: true, username: true, name: true },
  });

  return users.map((user) => ({
    value: user.id,
    label: `Nome: ${user.name}, User: ${user.username}`,
  }));
};
