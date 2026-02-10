import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import CortesPorOpConteudo from "./cortes-por-op-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Cortes",
};
type CortePorOpProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const CortePorOp = ({ searchParams }: CortePorOpProps) => {
  return (
    <Suspense>
      <CortePorOpWrapper searchParams={searchParams} />
    </Suspense>
  );
};

export default CortePorOp;

const CortePorOpWrapper = async ({ searchParams }: CortePorOpProps) => {
  await authorizePapelOrRedirect(PAPEL_JOANA);
  const queryClient = getQueryClient();
  const { esc } = await searchParams;
  const veEscondidas = esc === "true";

  void queryClient.prefetchQuery(
    trpc.joanaCortesPorOp.getCortesPorOp.queryOptions({
      op: null,
      veEscondidas: veEscondidas,
    }),
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
          <CortesPorOpConteudo veEscondidas={veEscondidas} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
