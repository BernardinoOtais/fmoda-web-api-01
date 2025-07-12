import { getSession } from "@repo/authweb/session";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const roleProtectedProcedure = (requiredPapel: string) =>
  baseProcedure.use(async ({ ctx, next }) => {
    const session = await getSession();

    if (!session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Proibido...",
      });
    }

    if (!session.papeis.includes(requiredPapel)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Sem acesso ao papel: ${requiredPapel}`,
      });
    }

    return next({ ctx: { ...ctx, auth: session } });
  });
