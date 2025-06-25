import { type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { prismaAuth } from "@repo/db/auth";

import { PrismaClient } from "@repo/db/auth";
import { customSession, username } from "better-auth/plugins";

import { hashPassword, verifyPassword } from "./argon2";

const prisma = new PrismaClient();

export const options = {
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
      const dadosUser = await prismaAuth.user.findUnique({
        where: { id: user.id },
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

      const result = {
        apelido: dadosUser?.apelido ?? "",
        papeis: dadosUser?.userPapeis.map((p) => p.Papeis.descPapel) ?? [],
      };
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          name: user.name,
          apelido: result.apelido,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
        },
        papeis: result.papeis,
      };
    }),
  ],
} satisfies BetterAuthOptions;
