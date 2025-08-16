import { hashPassword } from "@repo/encryption/argon2";

import { prismaAuth } from "@/prisma-servicos/auth/auth";

export const postAlteroPassword = async (userId: string, passWord: string) =>
  await prismaAuth.$transaction(async (tx) => {
    tx.session.deleteMany({
      where: { id: userId },
    });

    const hashedPassword = await hashPassword(passWord);

    await prismaAuth.account.updateMany({
      where: {
        userId,
        providerId: "credential",
      },
      data: {
        password: hashedPassword,
      },
    });
  });
