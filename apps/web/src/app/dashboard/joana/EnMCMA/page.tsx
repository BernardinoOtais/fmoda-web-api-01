import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import EntradasMCMAConteudo from "./entradas-mc-ma-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Malha em Cru e Acabada",
};

type EntradasMCMAProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const EntradasMCMA = async ({ searchParams }: EntradasMCMAProps) => {
  return (
    <Suspense>
      <EntradasMCMAWrapper searchParams={searchParams} />
    </Suspense>
  );
};

export default EntradasMCMA;

const EntradasMCMAWrapper = async ({ searchParams }: EntradasMCMAProps) => {
  await authorizePapelOrRedirect(PAPEL_JOANA);

  const { esc } = await searchParams;
  const veEscondidas = esc === "true";

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.joanaEntradasMcMa.getEntradasMcMa.queryOptions({
      op: null,
      veEscondidas: veEscondidas,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Malhas.."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar as Malhas..."
            />
          }
        >
          <EntradasMCMAConteudo veEscondidas={veEscondidas} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
