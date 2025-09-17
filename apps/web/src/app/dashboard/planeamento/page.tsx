import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import NovoPlaneamentoDialog from "./novo-planeamento-dialog";
import PlaneamentoConteudo from "./planeamento-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Planeamento",
};

type SearchParams = { [key: string]: string | string[] | undefined };
type PlaneamentoProps = { searchParams: Promise<SearchParams> };

const Planeamento = ({ searchParams }: PlaneamentoProps) => {
  return (
    <Suspense fallback={<div>Loading envio...</div>}>
      <PlaneamentoLoader searchParams={searchParams} />
    </Suspense>
  );
};

export default Planeamento;

const PlaneamentoLoader = async ({ searchParams }: PlaneamentoProps) => {
  const { novo, enviado } = await searchParams;
  await authorizePapelOrRedirect("Planeamento");
  const queryClient = getQueryClient();

  const estadoEnvios = enviado === "true";
  void queryClient.prefetchQuery(
    trpc.planeamento.getPlaneamentos.queryOptions({ enviado: estadoEnvios })
  );

  return (
    <>
      {novo === "true" && <NovoPlaneamentoDialog novo={novo} />}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <LoadingState
              title="A carregar Planeamentos"
              description="Pode demorar alguns segundos.."
            />
          }
        >
          <ErrorBoundary
            fallback={
              <ErrorState
                title="Erro!!"
                description="Não foi possível carregar os Planeamentos..."
              />
            }
          >
            <PlaneamentoConteudo />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};
