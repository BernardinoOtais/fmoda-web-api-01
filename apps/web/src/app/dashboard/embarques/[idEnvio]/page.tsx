import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { z } from "zod";

import NovoEnvio from "../novo-envio";
import WrapperIdEnvio from "./wrapper-idenvio";

import ErrorState from "@/components/ui-personalizado/states/error-state";
import LoadingState from "@/components/ui-personalizado/states/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Novo Embarque",
};

type EnvioPorIdProps = {
  params: Promise<{ idEnvio: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const niveis = z.object({
  nivel: z
    .union([
      z.string().transform((val) => [parseInt(val)]), // Single value as a string
      z.array(z.string().transform((val) => parseInt(val))), // Array of strings
    ])
    .default([]),
});

const EnvioPorId = ({ params, searchParams }: EnvioPorIdProps) => {
  return (
    <Suspense fallback={<div>Loading envio...</div>}>
      <EnvioLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default EnvioPorId;

const loadEnvioData = async ({ params, searchParams }: EnvioPorIdProps) => {
  const { idEnvio } = await params;

  const nIdEnvio = parseInt(idEnvio);

  if (isNaN(nIdEnvio)) {
    return { idEnvio: null, niveis: [] };
  }

  const { nivel } = await searchParams;

  const nivelParse = niveis.safeParse({ nivel });

  const niveisValidados = nivelParse.success ? nivelParse.data.nivel : [];

  return { idEnvio: nIdEnvio, niveis: niveisValidados };
};

const EnvioLoader = async ({ params, searchParams }: EnvioPorIdProps) => {
  await authorizePapelOrRedirect("Embarques");
  const { idEnvio, niveis } = await loadEnvioData({
    params,
    searchParams,
  });

  if (!idEnvio) {
    return <NovoEnvio aberto={true} />;
  }

  const queryClient = getQueryClient();

  const pai = niveis.at(-1);
  const idEnvioPai = { id: idEnvio, idd: pai };
  Promise.all([
    queryClient.prefetchQuery(
      trpc.embarquesIdEnvio.getEnvio.queryOptions({ id: idEnvio })
    ),
    queryClient.prefetchQuery(
      trpc.embarquesIdEnvio.getSelectedContainers.queryOptions(idEnvioPai)
    ),
    queryClient.prefetchQuery(
      trpc.embarquesIdEnvio.getContainers.queryOptions(idEnvioPai)
    ),
    queryClient.prefetchQuery(
      trpc.embarques.getDestinosDisponiveis.queryOptions(undefined, {
        staleTime: 1000 * 60 * 20,
      })
    ),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="A carregar Envio"
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
          <WrapperIdEnvio
            idEnvio={idEnvio}
            niveis={niveis}
            chave={idEnvioPai}
          />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
