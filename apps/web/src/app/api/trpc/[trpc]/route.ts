import { fetchRequestHandler } from "@repo/trpc";
import { createTRPCContext } from "@repo/trpc/init";
import { appRouter } from "@repo/trpc/_app";
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
export { handler as GET, handler as POST };
