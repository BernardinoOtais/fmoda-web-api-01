import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import EmbarquesConteudo from "./embarques-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { validadoValorNumeroItensPorPagina } from "@/lib/my-utils";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Embarques",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Embarques = ({ searchParams }: PageProps) => {
  return (
    <Suspense>
      <EmbarquesWrapper searchParams={searchParams} />
    </Suspense>
  );
};

export default Embarques;

const EmbarquesWrapper = async ({ searchParams }: PageProps) => {
  const { fechado, envpp, page } = await searchParams;
  await authorizePapelOrRedirect("Embarques");
  const valorFechado = fechado === "true";
  const valorPageActual = page ? parseInt(page as string) : 1;
  const intensPorPagina = validadoValorNumeroItensPorPagina(envpp);

  const heroItemCount = 0;

  const skip =
    (valorPageActual - 1) * intensPorPagina +
    (valorPageActual === 1 ? 0 : heroItemCount);

  const take =
    intensPorPagina + (valorPageActual - 1 === 1 ? heroItemCount : 0);

  const dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto = {
    skip,
    take,
    fechado: valorFechado,
    ordem: "desc",
  };

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.embarques.getEnviosAcessorios.queryOptions(dadosIniciais, {
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      staleTime: 0, // force data to go stale immediately
    })
  );
  void queryClient.prefetchQuery(
    trpc.embarques.getDestinosDisponiveis.queryOptions(undefined, {
      staleTime: 1000 * 60 * 20,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Envios"
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar os envios..."
            />
          }
        >
          <EmbarquesConteudo
            dadosIniciais={dadosIniciais}
            intensPorPagina={intensPorPagina}
            valorPageActual={valorPageActual}
          />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
