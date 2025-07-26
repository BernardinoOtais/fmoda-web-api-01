import {
  QueryClientProvider,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { QueryClient } from "@tanstack/react-query";

export {
  createTRPCClient,
  httpBatchLink,
  createTRPCContext,
  QueryClient,
  QueryClientProvider,
  fetchRequestHandler,
  createTRPCOptionsProxy,
  HydrationBoundary,
  dehydrate,
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  superjson,
  TRPCError,
};
