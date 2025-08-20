import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import PlaneamentoConteudo from "./planeamento-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const Planeamento = async () => {
  await authorizePapelOrRedirect("Planeamento");
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.planeamento.getOpAbertas.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Bms..."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar Bms..."
            />
          }
        >
          <PlaneamentoConteudo />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Planeamento;
