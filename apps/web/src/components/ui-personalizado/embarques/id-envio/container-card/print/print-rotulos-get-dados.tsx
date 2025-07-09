import { ContainerSchemaDto } from "@repo/tipos/embarques_idenvio";
import { useQuery, useQueryClient } from "@repo/trpc";
import React from "react";

import PrintRotulosWrapper from "./print-rotulos-wrapper";

import { useTRPC } from "@/trpc/client";

type PrintRotulosGetDadosProps = {
  idEnvio: number;
  idContainer: number;
  contentRef?: React.Ref<HTMLDivElement>;
  container: ContainerSchemaDto;
};
const PrintRotulosGetDados = ({
  idEnvio,
  idContainer,
  contentRef,
  container,
}: PrintRotulosGetDadosProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const envioData = queryClient.getQueryData(
    trpc.embarquesIdEnvio.getEnvio.queryKey({ id: idEnvio })
  );
  const { data, isLoading, isError } = useQuery({
    ...trpc.embarquesIdEnvio.getContainersConteudoToPrint.queryOptions({
      idEnvio,
      idContainer,
    }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data || !envioData?.Destinos || isError) return <div>Erro...</div>;
  return (
    <PrintRotulosWrapper
      contentRef={contentRef}
      container={container}
      className="shadow-lg"
      listaParaImprimrirDto={data}
    />
  );
};

export default PrintRotulosGetDados;
