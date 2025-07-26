import { useMutation, useQueryClient } from "@repo/trpc";
import { Minus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

type BoTaoRetiraOpProps = {
  idBm: string;
  op: number;
};
const BoTaoRetiraOp = ({ idBm, op }: BoTaoRetiraOpProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const apagaOp = useMutation(
    trpc.qualidade_balancom_op.deleteOp.mutationOptions({
      onMutate: () => {
        queryClient.cancelQueries(
          trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
        );
        const previousData = queryClient.getQueryData(
          trpc.qualidade_balancom_op.getBmDataViaId.queryKey(idBm)
        );

        queryClient.setQueryData(
          trpc.qualidade_balancom_op.getBmDataViaId.queryKey(idBm),
          (old) => {
            if (!old?.BmOp) return old;
            return {
              ...old,
              BmOp: old.BmOp.filter(
                (bmOp) => bmOp.op !== op && bmOp.idBm === idBm
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
          trpc.qualidade_balancom_op.getOpsCompativeis.queryOptions(idBm)
        );
        queryClient.invalidateQueries(
          trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
        );
      },
    })
  );

  return (
    <Button
      size="icon"
      onClick={() => apagaOp.mutate({ op, idBm })}
      className="cursor-pointer"
    >
      <Minus />
    </Button>
  );
};

export default BoTaoRetiraOp;
