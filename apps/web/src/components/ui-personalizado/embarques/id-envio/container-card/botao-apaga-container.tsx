"use client";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type BotaoApagaContainerProps = {
  idEnvio: number;
  idPai: number | null;
  idContainer: number;
  className?: string; // Optional `className` prop
  setScroll: (data: boolean) => void;
  nomeContainer: string;
};

const BotaoApagaContainer = ({
  idEnvio,
  idPai,
  idContainer,
  className,
  setScroll,
  nomeContainer,
}: BotaoApagaContainerProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const chave = {
    id: idEnvio,
    idd: idPai || undefined,
  };
  const apagaContainer = useMutation(
    trpc.embarquesIdEnvio.apagoContainer.mutationOptions({
      onSuccess: () => {
        toast.success(`Apagado correctament o ${nomeContainer.trim()}...`, {
          description: "Sucesso",
        });
        queryClient.invalidateQueries(
          trpc.embarquesIdEnvio.getContainers.queryOptions(chave)
        );
      },
      onError: (error) => {
        toast.error(error.message || "Erro ao apagar container...");
      },
    })
  );
  const apagaContainerFun = async () => {
    //apagoContainerDb

    setScroll(false);
    apagaContainer.mutate(idContainer);
  };

  const estaPendente = apagaContainer.isPending;

  return (
    <Button
      size="icon"
      disabled={estaPendente}
      onClick={() => apagaContainerFun()}
      className={cn(
        "relative flex items-center justify-center cursor-pointer", // Default classes
        className // Merge with custom classes
      )}
      title="Apaga Container"
    >
      {estaPendente && <Loader2 className="absolute animate-spin" />}
      {!estaPendente && <Trash2 />}
    </Button>
  );
};

export default BotaoApagaContainer;
