import "server-only"; // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy } from "@repo/trpc";
import { cache } from "react";
import { createTRPCContext } from "@repo/trpc/init";
import { makeQueryClient } from "@repo/trpc/query-client";
import { appRouter } from "@repo/trpc/_app";

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
