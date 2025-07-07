import { fetchRequestHandler } from "@repo/trpc";
import { appRouter } from "@repo/trpc/_app";
import { createTRPCContext } from "@repo/trpc/init";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
export { handler as GET, handler as POST };
