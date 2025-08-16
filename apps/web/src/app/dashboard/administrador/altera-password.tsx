import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import AlteroPassWordForm from "./altero-password-form";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const AlteraPassword = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.administrador.getUsers.queryOptions());
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
          <AlteroPassWordForm />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AlteraPassword;
