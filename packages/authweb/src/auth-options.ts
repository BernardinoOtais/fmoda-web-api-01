import { prisma } from "@repo/db/auth";
import { getUserDb } from "@repo/db/userweb";
import { hashPassword, verifyPassword } from "@repo/encryption/argon2";
import { type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession, username } from "better-auth/plugins";

export const options = {
  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") ?? [],
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    requireEmailVerification: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  hooks: {},
  databaseHooks: {},
  user: {
    additionalFields: {
      apelido: {
        type: "string",
        required: true,
      },
    },
  },
  plugins: [
    nextCookies(),
    username(),
    customSession(async ({ user, session }) => {
      //falta o apelido
      const dadosUser = await getUserDb(user.id);

      const apelido = dadosUser?.apelido ?? "";
      const papeis = dadosUser?.userPapeis.map((p) => p.Papeis.descPapel) ?? [];
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          name: user.name,
          apelido,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
        },
        papeis,
      };
    }),
  ],
} satisfies BetterAuthOptions;
