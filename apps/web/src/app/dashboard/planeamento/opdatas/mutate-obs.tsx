import { FornecedorSchemaParaUsar } from "@repo/tipos/planeamento";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type MutateObsProps = {
  op: string;
  stamp: string;
  obs: string;
};

const MutateObs = ({ op, obs, stamp }: MutateObsProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [raw, setRaw] = useState(obs ?? "");

  const [erro, setErro] = useState(false);

  const debounced = useDebounce(raw, 1250);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  useEffect(() => {
    setRaw(obs.toString() ?? "");
    setWasManuallyChanged(false);
  }, [obs]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: insiroObs, isPending } = useMutation(
    trpc.planeamento.postObs.mutationOptions({
      onMutate: async (valor) => {
        setErro(false);

        await queryClient.cancelQueries(
          trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: parseInt(op) })
        );

        const previousData = queryClient.getQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: parseInt(op) })
        );

        queryClient.setQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: parseInt(op) }),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              obs: valor.obs,
            };
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Fornecedor inserida com sucesso...");
        setWasManuallyChanged(false);
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        setRaw(obs?.toString() ?? "");
        toast.error("Não foi possível inserir a Fornecedor...");

        if (
          context?.previousData &&
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: parseInt(op) })
        ) {
          queryClient.setQueryData(
            trpc.planeamento.getOpCamioesEnvios.queryKey({ op: parseInt(op) }),
            context.previousData
          );
        }
      },
      onSettled: () => {
        if (
          trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: parseInt(op) })
        ) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({
              op: parseInt(op),
            })
          );
        }
      },
    })
  );

  useEffect(() => {
    if (!wasManuallyChanged) return;

    const parsed = FornecedorSchemaParaUsar.safeParse(debounced);

    if (!parsed.success) return;

    const novo = parsed.data;

    console.log("O tais novo : ", novo);

    if (obs !== undefined && novo === obs) {
      return;
    }

    if (erro || isPending) return;

    insiroObs({ bostamp: stamp, obs: novo ?? "" });
  }, [debounced, erro, insiroObs, isPending, stamp, obs, wasManuallyChanged]);

  return (
    <Textarea
      inputMode="text"
      disabled={isPending}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        setWasManuallyChanged(true);
      }}
      className="w-96"
      placeholder="Obs..."
    />
  );
};

export default MutateObs;
