import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";
import { ListaContainersDto } from "@repo/tipos/embarques_idenvio";
import { useSuspenseQuery } from "@repo/trpc";
import React from "react";

import Containers from "@/components/ui-personalizado/embarques/id-envio/containers";
import FooterWrapper from "@/components/ui-personalizado/embarques/id-envio/footer-wrapper";
import WrapperConteudoAcessorios from "@/components/ui-personalizado/embarques/id-envio/wrapper-conteudo-acessorios";
import { NIVEIS_INICIAIS } from "@/lib/constants";
import { useTRPC } from "@/trpc/client";

const containerNivelUmPossiveisDeInserir = (
  pai: number | undefined,
  containers: ListaContainersDto
) => {
  if (pai) return [];
  const conteudoContainerNivelUm = containers.map((item) =>
    item.TipoContainer?.Item.Descricao.trim()
  );

  const listaDeContainersNivelUmDisponivelParaInserir = NIVEIS_INICIAIS.filter(
    (item) => !conteudoContainerNivelUm?.includes(item)
  );
  return listaDeContainersNivelUmDisponivelParaInserir;
};

type ContainerConteudoFooterWrapperProps = {
  idEnvio: number;
  pai: number | undefined;
  chave: IdNumeroInteiroNaoNegativoDto;
};
const ContainerConteudoFooterWrapper = ({
  idEnvio,
  pai,
  chave,
}: ContainerConteudoFooterWrapperProps) => {
  const trpc = useTRPC();

  const { data: containers } = useSuspenseQuery(
    trpc.embarquesIdEnvio.getContainers.queryOptions({ id: idEnvio, idd: pai })
  );

  const numeroCOntainersNesteNovel = containers.containers.length;

  if (
    numeroCOntainersNesteNovel === 0 &&
    containers.idTipoContainer === 5 &&
    !!pai
  ) {
    return (
      <main className="relative grow ">
        <div className="absolute top-0 bottom-0 flex flex-col w-full space-y-2">
          <WrapperConteudoAcessorios idContainer={pai} idEnvio={idEnvio} />
        </div>
      </main>
    );
  }
  return (
    <>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col gap-1 overflow-auto">
            {numeroCOntainersNesteNovel > 0 && (
              <Containers
                listaContainersDto={containers.containers}
                idEnvio={idEnvio}
                chave={chave}
              />
            )}
          </div>
        </div>
      </main>
      <footer className="w-full px-1 py-2">
        <FooterWrapper
          idEnvio={idEnvio}
          pai={pai}
          containerNivelUmPossiveisDeInserir={containerNivelUmPossiveisDeInserir(
            pai,
            containers.containers
          )}
          idTipoContainer={containers.idTipoContainer}
        />
      </footer>
    </>
  );
};

export default ContainerConteudoFooterWrapper;
