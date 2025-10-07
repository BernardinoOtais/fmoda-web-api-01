import { FornecedorSchemaParaUsar } from "@repo/tipos/planeamento";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const [raw, setRaw] = useState(valorOriginal);
  const [erro, setErro] = useState(false);
  const debounced = useDebounce(raw, 1250);

  const wasManuallyChanged = useRef(false);

  const parsedOp = useMemo(() => {
    const parsed = parseInt(op);
    return isNaN(parsed) ? null : parsed;
  }, [op]);

  const queryKey = useMemo(
    () =>
      parsedOp
        ? trpc.planeamento.getOpCamioesEnvios.queryKey({ op: parsedOp })
        : null,
    [trpc.planeamento.getOpCamioesEnvios, parsedOp]
  );

  const queryOptions = useMemo(
    () =>
      parsedOp
        ? trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: parsedOp })
        : null,
    [trpc.planeamento.getOpCamioesEnvios, parsedOp]
  );

  useEffect(() => {
    setRaw(valorOriginal);
    wasManuallyChanged.current = false;
  }, [valorOriginal]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: insiroFornecedor, isPending } = useMutation(
    trpc.planeamento.postFornecedor.mutationOptions({
      onMutate: async (valor) => {
        if (!queryOptions || !queryKey) return;

        setErro(false);
        await queryClient.cancelQueries(queryOptions);

        const previousData = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            fornecedor: valor.fornecedor,
          };
        });

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Fornecedor inserido com sucesso");
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        toast.error("Não foi possível inserir o Fornecedor");

        if (context?.previousData && queryKey) {
          queryClient.setQueryData(queryKey, context.previousData);

          setRaw(valorOriginal);
        }
      },
      onSettled: () => {
        if (queryOptions) {
          void queryClient.refetchQueries(queryOptions);
        }
      },
    })
  );

  useEffect(() => {
    if (!wasManuallyChanged.current) return;
    if (!parsedOp) return;
    if (erro || isPending) return;

    const parsed = FornecedorSchemaParaUsar.safeParse(debounced);
    if (!parsed.success) return;

    const novo = parsed.data;

    if (novo === valorOriginal) return;

    insiroFornecedor({ op: parsedOp, fornecedor: novo });
    wasManuallyChanged.current = false;
  }, [debounced, erro, insiroFornecedor, isPending, parsedOp, valorOriginal]);

  return (
    <Input
      inputMode="text"
      disabled={isPending}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        wasManuallyChanged.current = true;
      }}
      className="w-96"
      placeholder="Fornecedor..."
    />
  );
};

export default MutateFornecededor;
