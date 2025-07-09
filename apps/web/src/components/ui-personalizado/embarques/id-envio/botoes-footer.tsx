import {
  Container,
  ContainersExistentes,
  TodosOsContainers,
} from "@repo/tipos/consts";
import {
  EmbarqueBreadCrumbContainers,
  PostContainerSchemaDto,
} from "@repo/tipos/embarques";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTRPC } from "@/trpc/client";

type BoatoesFooterProps = {
  idEnvio: number;
  idContainerPai?: number | undefined;
  lista?: string[];
  migalhas?: EmbarqueBreadCrumbContainers[];
  idTipoContainer?: number;
};
const BoatoesFooter = ({
  idEnvio,
  idContainerPai,
  lista,
  migalhas,
  idTipoContainer,
}: BoatoesFooterProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [disable, setDisable] = useState(false);
  const postNovoContainer = useMutation(
    trpc.embarquesIdEnvio.postNovoContainer.mutationOptions({
      onSuccess: (data) => {
        if (data) {
          queryClient.resetQueries(
            trpc.embarquesIdEnvio.getContainers.queryOptions({
              id: idEnvio,
              idd: idContainerPai,
            })
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        setDisable(false);
      },
    })
  );
  const novoContainair = async (idTipoContainer: number) => {
    setDisable(true);
    const dados: PostContainerSchemaDto = {
      idEnvio,
      idTipoContainer,
      idContainerPai: idContainerPai || null,
    };
    postNovoContainer.mutate(dados);
  };
  let containers: Container[] = [];
  if (lista) {
    containers = lista.map(
      (c) => ContainersExistentes[c as keyof TodosOsContainers]
    );
  }

  if (migalhas) {
    if (!migalhas || migalhas.length === 0 || migalhas.length === 3)
      return null;

    const primeiroNome = migalhas[0]?.nome;
    if (!primeiroNome) return null;

    const primeiroNivel =
      ContainersExistentes[primeiroNome as keyof TodosOsContainers];
    if (!primeiroNivel) return null;

    if (idTipoContainer !== undefined && idTipoContainer <= 3) {
      containers = primeiroNivel.subContainer ?? [];
    } else {
      const segundoNivel = primeiroNivel.subContainer?.[0];
      if (!segundoNivel) return [];
      containers = segundoNivel.subContainer ?? [];
    }
  }

  const botoesAApresentar = containers.map((b) => {
    return (
      <TooltipProvider key={b.nome}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              disabled={disable}
              onClick={() => novoContainair(b.idTipoContainer)}
              className="relative flex items-center justify-center cursor-pointer"
            >
              {disable && <Loader2 className="absolute animate-spin" />}
              {!disable && <b.icon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{b.nome}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  });
  return botoesAApresentar;
};

export default BoatoesFooter;
