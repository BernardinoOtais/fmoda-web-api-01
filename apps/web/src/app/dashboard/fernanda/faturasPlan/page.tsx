import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import FaturacaoPlaneadaConteudo from "@/components/ui-personalizado/faturacao-planeada/faturacao-planeada-conteudo";
import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

const FaturasPlaneadas = async () => {
  await authorizePapelOrRedirect(PAPEL_JOANA);
  const queryClient = getQueryClient();
  const today = new Date();

  // First day of current month
  const dataIni = new Date(today.getFullYear(), today.getMonth(), 1);

  // Last day of current month
  const dataFini = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  void queryClient.prefetchQuery(
    trpc.joanaFaturacaoPlaneada.getFaturacaoPlaneada.queryOptions({
      dataIni,
      dataFini,
      fornecedor: null,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Faturas Planeadas.."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar as Faturas Planeadas..."
            />
          }
        >
          <FaturacaoPlaneadaConteudo dataIni={dataIni} dataFini={dataFini} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default FaturasPlaneadas;
