"use client";
// ^-- to make sure we can mount the Provider from a server component
import { QueryClientProvider } from "@repo/trpc";
import { createTRPCClient, httpBatchLink } from "@repo/trpc";
import { createTRPCContext } from "@repo/trpc";
import { superjson } from "@repo/trpc";
import { makeQueryClient } from "@repo/trpc/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import type { QueryClient } from "@repo/trpc";
import type { AppRouter } from "@repo/trpc/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
function getUrl() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/trpc`;
  }
  // Fallback for SSR
  return process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`
    : "http://localhost:3000/api/trpc";
}
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
