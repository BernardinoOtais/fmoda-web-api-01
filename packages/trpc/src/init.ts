import { getSession } from "@repo/authweb/session";
import loggerWeb from "@repo/logger/logger-web";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const session = await getSession();

  return {
    session,
  };
});

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
  baseProcedure.use(async ({ ctx, next, path, type }) => {
    const start = Date.now();

    const session = await getSession();

    const baseLogData = {
      path,
      type,
      requiredRole: requiredPapel,
      timestamp: new Date().toISOString(),
    };
    //console.log(session);

    if (!session) {
      const duration = Date.now() - start;
      loggerWeb.warn("Authentication Failed", {
        ...baseLogData,
        duration: `${duration}ms`,
        reason: "No session found",
        securityEvent: true,
      });

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Proibido....",
      });
    }
    const userName = session.user.name;
    const userRoles = session.papeis || [];
    if (!session.papeis.includes(requiredPapel)) {
      const duration = Date.now() - start;

      // Log authorization failure - this is a security event
      loggerWeb.warn("Authorization Failed", {
        ...baseLogData,
        duration: `${duration}ms`,
        userName,
        userRoles:
          process.env.NODE_ENV === "development" ? userRoles : "[REDACTED]",
        reason: `User lacks required role: ${requiredPapel}`,
        securityEvent: true,
      });

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Sem acesso ao papel: ${requiredPapel}`,
      });
    }
    const duration = Date.now() - start;

    // Log successful execution
    loggerWeb.info("Protected Procedure Success", {
      ...baseLogData,
      duration: `${duration}ms`,
      userName,
    });

    return next({ ctx: { ...ctx, auth: session } });
  });
