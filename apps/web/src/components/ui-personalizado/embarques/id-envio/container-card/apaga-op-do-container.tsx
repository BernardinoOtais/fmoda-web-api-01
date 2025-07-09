import { ContainerDto, IdOpSchemaDto } from "@repo/tipos/embarques_idenvio";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

type ApagaOpDoContainerProps = {
  idEnvio: number;
  container: ContainerDto;
  op: number;
  idContainer: number;

  setScroll: (data: boolean) => void;
};
const ApagaOpDoContainer = ({
  idEnvio,
  container,
  op,
  idContainer,

  setScroll,
}: ApagaOpDoContainerProps) => {
  const chave = {
    id: idEnvio,
    idd: container.idContainerPai || undefined,
  };

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  //apagoOpContainer
  const apagaOp = useMutation(
    trpc.embarquesIdEnvio.apagoOpContainer.mutationOptions({
      onSuccess: () => {
        toast.success(`OP ${op} apagada com sucesso.`);
        queryClient.invalidateQueries(
          trpc.embarquesIdEnvio.getContainers.queryOptions(chave)
        );
      },
      onError: (error) => {
        toast.error(error.message || "Erro ao apagar OP.");
      },
    })
  );

  const apagaOpContainerFun = async () => {
    setScroll(false);
    const dados: IdOpSchemaDto = { id: idContainer, op };
    apagaOp.mutate(dados);
  };
  const apagaOpEstado = apagaOp.isPending;
  return (
    <Button
      disabled={apagaOpEstado}
      className="group relative mx-1 mt-1 w-24 cursor-pointer"
      variant={"outline"}
      onClick={() => apagaOpContainerFun()}
    >
      <span>{`Op ${op}`}</span>
      {apagaOpEstado && <Loader2 className="absolute animate-spin" />}
      <Badge
        variant="destructive"
        className="absolute top-[-14px] right-[-10px] hidden h-5 w-5 items-center justify-center rounded-full text-xs font-bold group-hover:flex"
      >
        {"x"}
      </Badge>
      {/* Hover Badge */}
    </Button>
  );
};

export default ApagaOpDoContainer;
