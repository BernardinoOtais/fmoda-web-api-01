import { FornecedorSchemaParaUsar } from "@repo/tipos/planeamento";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type MutateFornecedorProps = {
  op: string;
  valorOriginal: string;
};

const MutateFornecededor = ({ valorOriginal, op }: MutateFornecedorProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [raw, setRaw] = useState(valorOriginal ?? "");

  const [erro, setErro] = useState(false);

  const debounced = useDebounce(raw, 1250);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  useEffect(() => {
    setRaw(valorOriginal.toString() ?? "");
    setWasManuallyChanged(false);
  }, [valorOriginal]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: insiroFornecedor, isPending } = useMutation(
    trpc.planeamento.postFornecedor.mutationOptions({
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
              fornecedor: valor.fornecedor,
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
        setRaw(valorOriginal?.toString() ?? "");
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

    if (valorOriginal !== undefined && novo === valorOriginal) {
      return;
    }

    if (erro || isPending) return;
    insiroFornecedor({ op: parseInt(op), fornecedor: novo });
  }, [
    debounced,
    erro,
    insiroFornecedor,
    isPending,
    op,
    valorOriginal,
    wasManuallyChanged,
  ]);

  return (
    <Input
      inputMode="text"
      disabled={isPending}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        setWasManuallyChanged(true);
      }}
      className="w-96"
      placeholder="Fornecedor..."
    />
  );
};

export default MutateFornecededor;
