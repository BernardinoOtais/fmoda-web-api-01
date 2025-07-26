import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import BmConteudo from "./bm-conteudo";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { validadoValorNumeroItensPorPagina } from "@/lib/my-utils";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Balanço de Maças",
};

type BalancoDeMacasProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const BalancoDeMacas = ({ searchParams }: BalancoDeMacasProps) => {
  return (
    <Suspense>
      <BalancoDeMacasWrapper searchParams={searchParams} />
    </Suspense>
  );
};

export default BalancoDeMacas;

const BalancoDeMacasWrapper = async ({ searchParams }: BalancoDeMacasProps) => {
  await authorizePapelOrRedirect(PAPEL_ROTA_QUALIDADE);
  const { fechado, envpp, page } = await searchParams;
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
    trpc.qualidadeBalancoM.getBms.queryOptions(dadosIniciais)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Bms..."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar Bms..."
            />
          }
        >
          <BmConteudo
            dadosIniciais={dadosIniciais}
            intensPorPagina={intensPorPagina}
            valorPageActual={valorPageActual}
          />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

//   <BmConteudo dadosIniciais={dadosIniciais} />;
