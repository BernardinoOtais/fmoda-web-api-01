import { useMutation, useQueryClient } from "@repo/trpc";
import { Minus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

type BotaoApagaMalhaProps = {
  idBm: string;
  ref: string;
  op: number;
};

const BotaoApagaMalha = ({ idBm, ref, op }: BotaoApagaMalhaProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const apagaMalha = useMutation(
    trpc.qualidade_balancom_op.deleteBmApagaMalha.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries(
          trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
        );
        const previousData = queryClient.getQueryData(
          trpc.qualidade_balancom_op.getBmDataViaId.queryKey(idBm)
        );

        queryClient.setQueryData(
          trpc.qualidade_balancom_op.getBmDataViaId.queryKey(idBm),
          (old) => {
            if (!old?.BmMalhas) return old;
            return {
              ...old,
              BmMalhas: old.BmMalhas.filter(
                (item) => !(item.idBm === idBm && item.ref === ref)
              ),
            };
          }
        );

        return { previousData };
      },
      onError: (_error, _updatedEnvio, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.qualidade_balancom_op.getBmDataViaId.queryKey(idBm),
            context.previousData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
        );
      },
    })
  );

  return (
    <Button
      size="icon"
      onClick={() =>
        apagaMalha.mutate({
          idBm,
          ref,
          op,
        })
      }
    >
      <Minus />
    </Button>
  );
};

export default BotaoApagaMalha;
