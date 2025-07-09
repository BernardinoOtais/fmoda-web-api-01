import { useQuery, useQueryClient } from "@repo/trpc";
import React from "react";

import PrintPalletWrapper from "./print-pallet-wrapper";

import { useTRPC } from "@/trpc/client";

type PrintPalletGetDadosProps = {
  idEnvio: number;
  idContainer: number;
  contentRef?: React.Ref<HTMLDivElement>;
};
const PrintPalletGetDados = ({
  idEnvio,
  idContainer,
  contentRef,
}: PrintPalletGetDadosProps) => {
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
    <PrintPalletWrapper
      contentRef={contentRef}
      destino={envioData.Destinos}
      idEnvio={idEnvio}
      className="shadow-lg"
      idContainer={idContainer}
      listaParaImprimrirDto={data}
    />
  );
};

export default PrintPalletGetDados;
