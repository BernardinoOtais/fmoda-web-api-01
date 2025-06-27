import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
  QueryClientProvider,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import superjson from "superjson";

import { TRPCError } from "@trpc/server";

export {
  createTRPCClient,
  httpBatchLink,
  createTRPCContext,
  QueryClient,
  QueryClientProvider,
  fetchRequestHandler,
  createTRPCOptionsProxy,
  useQuery,
  HydrationBoundary,
  dehydrate,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  superjson,
  TRPCError,
};
