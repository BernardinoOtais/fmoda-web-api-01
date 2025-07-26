import { BmTabelaDto } from "@repo/tipos/qualidade_balancom";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Corpo from "@/components/ui-personalizado/balancom-op/corpo";
import Header from "@/components/ui-personalizado/balancom-op/header";
import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

type BmOpWraperProps = { bm: BmTabelaDto; op: number };
const BmOpWraper = ({ bm, op }: BmOpWraperProps) => {
  const { idBm } = bm;
  const queryClient = getQueryClient();

  Promise.all([
    queryClient.prefetchQuery(
      trpc.qualidade_balancom_op.getTcsss.queryOptions(idBm)
    ),
    queryClient.prefetchQuery(
      trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
    ),
    queryClient.prefetchQuery(
      trpc.qualidade_balancom_op.getOpsCompativeis.queryOptions(idBm)
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Bm desta op..."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar Bm desta op..."
            />
          }
        >
          <>
            <Header idBm={bm.idBm} op={op} composicao={bm.composicao} />

            <Corpo idBm={bm.idBm} op={op} />
          </>
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default BmOpWraper;
