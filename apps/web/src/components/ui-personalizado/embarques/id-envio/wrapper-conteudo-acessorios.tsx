import { ListaContudoDto } from "@repo/tipos/embarques_idenvio";
import { useQuery } from "@repo/trpc";
import React from "react";

import ConteudoExistente from "./conteudo/conteudo-existente";
import WrapperInsereConteudo from "./conteudo/wrapper-insere-conteudo";

import { useTRPC } from "@/trpc/client";

type WrapperConteudoAcessoriosProps = {
  idContainer: number;
  idEnvio: number;
};
const WrapperConteudoAcessorios = ({
  idEnvio,
  idContainer,
}: WrapperConteudoAcessoriosProps) => {
  const trpc = useTRPC();
  const {
    data: conteudo,
    isLoading,
    isError,
  } = useQuery(
    trpc.embarquesIdEnvio.getConteudo.queryOptions({ id: idContainer })
  );

  if (isError) return <div>erro..</div>;
  if (isLoading) return <div>Loading..</div>;
  const conteudoValido = conteudo;

  return (
    <div className="flex flex-col gap-1 w-full">
      <ConteudoExistente
        idContainer={idContainer}
        idEnvio={idEnvio}
        conteudos={dadosOrdenados(conteudoValido ?? [])}
        conteudosAgrupados={conteudosAgrupados(conteudoValido ?? [])}
      />

      <WrapperInsereConteudo idEnvio={idEnvio} idContainer={idContainer} />
    </div>
  );
};

export default WrapperConteudoAcessorios;

const conteudosAgrupados = (conteudos: ListaContudoDto) =>
  conteudos?.reduce(
    (acc, item) => {
      if (!acc[item.idItem]) {
        acc[item.idItem] = {
          idItem: item.idItem,
          totalQtt: 0,
          totalPeso: 0,
          count: 0,
        };
      }

      const grupo = acc[item.idItem]!;
      grupo.totalQtt += item.qtt;
      grupo.totalPeso += item.peso;
      grupo.count += 1;

      return acc;
    },
    {} as Record<
      number,
      {
        idItem: number;
        totalQtt: number;
        totalPeso: number;
        count: number;
      }
    >
  ) || {};

const dadosOrdenados = (conteudos: ListaContudoDto) =>
  conteudos?.sort((a, b) => a.idItem - b.idItem);
