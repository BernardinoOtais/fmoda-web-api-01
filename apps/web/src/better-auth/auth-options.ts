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
      const papeis = (
        await prismaAuth.userPapeis.findMany({
          where: { userId: user.id },
          select: { Papeis: { select: { descPapel: true } } },
        })
      ).map((p) => p.Papeis.descPapel);
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
        },
        papeis,
      };
    }),
  ],
} satisfies BetterAuthOptions;
