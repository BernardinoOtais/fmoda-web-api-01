"use client";
import NItensPorPagina from "@/components/ui-personalizado/meus-components/n-itens-por-pagina";
import Paginacao from "@/components/ui-personalizado/meus-components/paginacao";
import { useTRPC } from "@/trpc/client";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { EnvioDto } from "@repo/tipos/embarques";
import { useSuspenseQuery } from "@repo/trpc";
import React from "react";
import WrapperEnvios from "./wrapper-envios";
import SwitchFechado from "./switch-fechado";
import NovoEnvio from "./novo-envio";

type EmbarquesConteudoFinalProps = {
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
  intensPorPagina: number;
  valorPageActual: number;
};
const EmbarquesConteudoFinal = ({
  dadosIniciais,
  intensPorPagina,
  valorPageActual,
}: EmbarquesConteudoFinalProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.getEnviosAcessorios.queryOptions(dadosIniciais)
  );

  const { fechado: valorFechado } = dadosIniciais;
  const heroItemCount = 0;
  const totalPages = Math.ceil(
    (data.tamanhoLista - heroItemCount) / intensPorPagina
  );

  const enviosRecebidos: EnvioDto[] = data.lista || [];
  return (
    <>
      <header className="x-1 space-y-1.5 border-b py-3 text-center">
        <div className="flex items-center space-x-2">
          <SwitchFechado fechado={valorFechado} />
          {valorFechado !== true && (
            <div className="mx-auto">
              <NovoEnvio dadosIniciais={dadosIniciais} />
            </div>
          )}
          {data.tamanhoLista > 10 && (
            <div className="mx-auto">
              <NItensPorPagina
                itensPorPagina={intensPorPagina}
                tamanhoLista={data.tamanhoLista}
              />
            </div>
          )}
        </div>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto">
            <WrapperEnvios
              envios={enviosRecebidos}
              dadosIniciais={dadosIniciais}
            />
          </div>
        </div>
      </main>
      {totalPages > 1 && (
        <footer className="w-full px-1 py-3">
          <Paginacao
            paginaActual={valorPageActual}
            totalPaginas={totalPages}
            envpp={intensPorPagina}
          />
        </footer>
      )}
    </>
  );
};

export default EmbarquesConteudoFinal;
