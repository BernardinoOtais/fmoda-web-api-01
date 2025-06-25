import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { useQuery } from "@tanstack/react-query";

export {
  createTRPCClient,
  httpBatchLink,
  createTRPCContext,
  QueryClient,
  QueryClientProvider,
  fetchRequestHandler,
  createTRPCOptionsProxy,
  useQuery,
};
