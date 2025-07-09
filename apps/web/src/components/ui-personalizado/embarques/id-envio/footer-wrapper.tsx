import { useSuspenseQuery } from "@repo/trpc";
import React from "react";

import BoatoesFooter from "./botoes-footer";

import { useTRPC } from "@/trpc/client";

type FooterWrapperProps = {
  idEnvio: number;
  pai: number | undefined;
  containerNivelUmPossiveisDeInserir: string[];
  idTipoContainer?: number;
};

const FooterWrapper = ({
  idEnvio,
  pai,
  containerNivelUmPossiveisDeInserir,
  idTipoContainer,
}: FooterWrapperProps) => {
  const trpc = useTRPC();

  const { data: migalhas } = useSuspenseQuery({
    ...trpc.embarquesIdEnvio.getSelectedContainers.queryOptions({
      id: idEnvio,
      idd: pai,
    }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  if (!pai) {
    return (
      <div className="flex gap-1">
        <BoatoesFooter
          idEnvio={idEnvio}
          lista={containerNivelUmPossiveisDeInserir}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <BoatoesFooter
        idEnvio={idEnvio}
        idContainerPai={pai}
        migalhas={migalhas}
        idTipoContainer={idTipoContainer}
      />
    </div>
  );
};

export default FooterWrapper;
