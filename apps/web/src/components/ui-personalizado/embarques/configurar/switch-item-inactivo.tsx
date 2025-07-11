"use client";

import { useMutation, useQueryClient } from "@repo/trpc";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { useTRPC } from "@/trpc/client";

type SwitchItemInactivoProps = {
  idItem: number;
  inactivo: boolean;
};
const SwitchItemInactivo = ({ inactivo, idItem }: SwitchItemInactivoProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const patchEstadoItem = useMutation(
    trpc.embarquesConfigurar.patchEstadoItem.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
        );
        const previousData = queryClient.getQueryData(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey()
        );
        queryClient.setQueryData(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey(),
          (old: typeof previousData) =>
            old
              ? {
                  ...old,
                  itemsSchema: old.itemsSchema.map((item) =>
                    item.idItem === idItem
                      ? { ...item, inativo: !item.inativo }
                      : item
                  ),
                }
              : old
        );
        return { previousData };
      },
      onError: (_error, _updatedEnvio, context) => {
        toast.error("Erro inesperado ao alterar estado do item:", {
          description:
            _error instanceof Error ? _error.message : "Erro desconhecido",
        });
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey(),
            context.previousData
          );
        }
      },
      onSettled: () => {
        setIsLoading(false);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("idItem");
        queryClient.invalidateQueries(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
        );
      },
      onSuccess: () => {
        toast.success(`Estado alterado..`, {
          description: "Sucesso",
        });
      },
    })
  );

  const alteraEstadoDeItem = async () => {
    if (isLoading) return;
    setIsLoading(true);
    patchEstadoItem.mutate({ id: idItem });
  };

  return (
    <>
      <Switch
        disabled={isLoading}
        id="envio-fechado"
        checked={inactivo}
        onCheckedChange={alteraEstadoDeItem}
      />
    </>
  );
};

export default SwitchItemInactivo;
