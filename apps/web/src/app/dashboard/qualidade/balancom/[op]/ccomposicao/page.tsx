import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import { OPschema } from "@repo/tipos/qualidade_balancom";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import ComposicaoOpWrapper from "./composicao-op-wrapper";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

type CalaculoComposicaoProps = {
  params: Promise<{ op: string }>;
};

const CalaculoComposicao = ({ params }: CalaculoComposicaoProps) => {
  return (
    <Suspense>
      <CalaculoComposicaoWrapper params={params} />
    </Suspense>
  );
};

export default CalaculoComposicao;

const CalaculoComposicaoWrapper = async ({
  params,
}: CalaculoComposicaoProps) => {
  await authorizePapelOrRedirect(PAPEL_ROTA_QUALIDADE);
  const queryClient = getQueryClient();
  const op = await params;
  const opRecebida = OPschema.safeParse(op);
  if (!opRecebida.success) {
    return <div>Não tem Op...</div>;
  }
  void queryClient.prefetchQuery(
    trpc.qualidade_balancom_op_composicao.getBmDadosParaCalculoComposicao.queryOptions(
      { op: opRecebida.data.op }
    )
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar composição..."
            description="Pode demorar alguns segundos.."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Erro!!"
              description="Não foi possível carregar a composição..."
            />
          }
        >
          <ComposicaoOpWrapper op={opRecebida.data.op} />;
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
