import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import ContaCorrenteConteudo from "./conta-corrente-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const ContaCorrentePorFornecedor = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.joanaContaCorrente.getFonecedores.queryOptions(),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Fornecedores.."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar as Fornecedores..."
            />
          }
        >
          <ContaCorrenteConteudo />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default ContaCorrentePorFornecedor;
