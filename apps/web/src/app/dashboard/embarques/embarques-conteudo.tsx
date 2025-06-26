"use client";
import { useTRPC } from "@/trpc/client";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { useSuspenseQuery } from "@repo/trpc";
import React from "react";

type EmbarquesConteudoProps = {
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
  intensPorPagina: number;
  valorPageActual: number;
};
const EmbarquesConteudo = ({
  dadosIniciais,
  intensPorPagina,
  valorPageActual,
}: EmbarquesConteudoProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.getEnviosAcessorios.queryOptions(dadosIniciais)
  );
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default EmbarquesConteudo;
