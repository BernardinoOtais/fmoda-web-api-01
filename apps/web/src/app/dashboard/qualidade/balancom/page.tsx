import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import { Metadata } from "next";
import React, { Suspense } from "react";

import { validadoValorNumeroItensPorPagina } from "@/lib/my-utils";

export const metadata: Metadata = {
  title: "Balanço de Maças",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const BalancoDeMacas = ({ searchParams }: PageProps) => {
  return (
    <Suspense>
      <BalancoDeMacasWrapper searchParams={searchParams} />
    </Suspense>
  );
};

export default BalancoDeMacas;

const BalancoDeMacasWrapper = async ({ searchParams }: PageProps) => {
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

  return <div>{JSON.stringify(dadosIniciais)}</div>;
};
