import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import FaturacaoConteudo from "./faturacao-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const Faturacao = () => {
  const queryClient = getQueryClient();
  const today = new Date();

  const dayOfWeek = today.getDay();

  const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;

  const dataIni = new Date(today);
  dataIni.setDate(today.getDate() - (isoDay - 1));

  const dataFini = new Date(dataIni);
  dataFini.setDate(dataIni.getDate() + 6);

  void queryClient.prefetchQuery(
    trpc.joanaFaturacao.getFaturacao.queryOptions({
      dataIni,
      dataFini,
      op: null,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Faturas.."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar as Faturas..."
            />
          }
        >
          <FaturacaoConteudo dataIni={dataIni} dataFini={dataFini} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Faturacao;
