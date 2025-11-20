import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import EstampadosEBordados from "./estampados-e-bordados";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const EstampariaEBordados = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryOptions({
      op: null,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Estampados e Bordados.."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar os Estampados e Bordados..."
            />
          }
        >
          <EstampadosEBordados />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default EstampariaEBordados;
