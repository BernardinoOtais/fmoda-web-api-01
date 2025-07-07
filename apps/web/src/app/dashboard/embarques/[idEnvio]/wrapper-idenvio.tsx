"use client";
import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";
import { useSuspenseQuery } from "@repo/trpc";
import React from "react";

import NovoEnvio from "../novo-envio";
import ContainerConteudoFooterWrapper from "./container-conteudo-footer-wrapper";

import BreadCrumbs from "@/components/ui-personalizado/embarques/id-envio/bread-crumbs";
import DestinosDesteEnvio from "@/components/ui-personalizado/embarques/id-envio/destinos-deste-envio";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type WrapperIdEnvioProps = {
  idEnvio: number;
  niveis: number[];
  chave: IdNumeroInteiroNaoNegativoDto;
};
const WrapperIdEnvio = ({ idEnvio, niveis, chave }: WrapperIdEnvioProps) => {
  const trpc = useTRPC();

  const { data: envioData } = useSuspenseQuery(
    trpc.getEnvio.queryOptions({ id: idEnvio })
  );

  if (!envioData) {
    return <NovoEnvio aberto={true} />;
  }

  const envioDB = envioData;
  const pai = niveis.at(-1);

  return (
    <>
      <header className="x-1 space-y-1.5 border-b py-3 text-center ">
        <h1 className="text-lg font-bold">
          Envio: <span className="font-medium">{envioDB.nomeEnvio}</span>
        </h1>
        <div className="flex items-center justify-center">
          <h2 className="text-md font-semibold ">Destino:</h2>
          <DestinosDesteEnvio
            idEnvio={idEnvio}
            idDestino={envioDB.Destinos.idDestino}
          />
        </div>
        <h3
          className={cn(
            "flex items-center justify-center pt-3",
            niveis.length === 0 && "hidden"
          )}
        >
          {pai && <BreadCrumbs idEnvio={idEnvio} ultimoNivel={pai} />}
        </h3>
      </header>
      <ContainerConteudoFooterWrapper
        idEnvio={idEnvio}
        pai={pai}
        chave={chave}
      />
    </>
  );
};

export default WrapperIdEnvio;
