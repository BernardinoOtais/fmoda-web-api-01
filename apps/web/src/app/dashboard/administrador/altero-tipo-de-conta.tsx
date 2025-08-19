import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import AlteroTipoDeContaForm from "./altero-tipo-de-conta-form";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const AlteroTipoDeConta = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.administrador.getPapeis.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar papeis"
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível papeis..."
            />
          }
        >
          <AlteroTipoDeContaForm />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AlteroTipoDeConta;
