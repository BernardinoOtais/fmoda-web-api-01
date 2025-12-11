import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import EntradasMCMAConteudo from "./entradas-mc-ma-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const EntradasMCMA = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.joanaEntradasMcMa.getEntradasMcMa.queryOptions({ op: null })
  );

  console.log("cernas e coisas");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Malhas.."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar as Malhas..."
            />
          }
        >
          <EntradasMCMAConteudo />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default EntradasMCMA;
