import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Acessorios from "./acessorios";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

type AcessoriosWrapperProps = { idRecebido: number | null };
const AcessoriosWrapper = ({ idRecebido }: AcessoriosWrapperProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar itens"
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível itens..."
            />
          }
        >
          <Acessorios idRecebido={idRecebido} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AcessoriosWrapper;
