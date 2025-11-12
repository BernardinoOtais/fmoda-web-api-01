import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import CortesPorOpConteudo from "./cortes-por-op-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const CortePorOp = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.joanaCortesPorOp.getCortesPorOp.queryOptions({ op: null })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Ops.."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar as Ops..."
            />
          }
        >
          <CortesPorOpConteudo />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default CortePorOp;
