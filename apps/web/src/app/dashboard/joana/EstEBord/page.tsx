import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import EstampadosEBordados from "./estampados-e-bordados";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Estampados e Bordados",
};

type EstampariaEBordadosProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const EstampariaEBordados = ({ searchParams }: EstampariaEBordadosProps) => {
  return (
    <Suspense>
      <EstampariaEBordadosWrapper searchParams={searchParams} />
    </Suspense>
  );
};

export default EstampariaEBordados;

const EstampariaEBordadosWrapper = async ({
  searchParams,
}: EstampariaEBordadosProps) => {
  await authorizePapelOrRedirect(PAPEL_JOANA);
  const queryClient = getQueryClient();
  const { esc } = await searchParams;
  const veEscondidas = esc === "true";
  void queryClient.prefetchQuery(
    trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryOptions({
      op: null,
      veEscondidas: veEscondidas,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Estampados e Bordados.."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar os Estampados e Bordados..."
            />
          }
        >
          <EstampadosEBordados veEscondidas={veEscondidas} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
