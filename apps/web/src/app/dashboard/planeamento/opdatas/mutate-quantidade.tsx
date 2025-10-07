import { NumeroOuZero } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { isParsableNumber } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type MutateQuantidadeProps = {
  op: number;
  variavel: "u_camqtt" | "u_dfqtt";
  nQtt: number;
  valorOriginal: number;
};
const MutateQuantidade = ({
  op,
  variavel,
  nQtt,
  valorOriginal,
}: MutateQuantidadeProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [raw, setRaw] = useState(valorOriginal?.toString() ?? "");

  const [erro, setErro] = useState(false);

  const debounced = useDebounce(raw, 1250);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  // CHANGE 1: Use ref to track the last submitted value
  const lastSubmittedValue = useRef<number | null>(null);

  useEffect(() => {
    setRaw(valorOriginal.toString() ?? "");
    setWasManuallyChanged(false);
    lastSubmittedValue.current = valorOriginal;
  }, [valorOriginal]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: insereQtt, isPending } = useMutation(
    trpc.planeamento.postDeQtt.mutationOptions({
      onMutate: async (valor) => {
        setErro(false);

        await queryClient.cancelQueries(
          trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
        );

        const previousData = queryClient.getQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        );

        queryClient.setQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op }),
          (old) => {
            if (!old) return old;

            return old.map((opDados) => {
              if (opDados.op !== op) return opDados;

              return {
                ...opDados,
                camioes:
                  variavel === "u_camqtt"
                    ? opDados.camioes.map((c) =>
                        c.n === nQtt ? { ...c, alor: valor.qtt } : c
                      )
                    : opDados.camioes,
                envios:
                  variavel === "u_dfqtt"
                    ? opDados.envios.map((e) =>
                        e.n === nQtt ? { ...e, valor: valor.qtt } : e
                      )
                    : opDados.envios,
              };
            });
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Fornecedor inserido com sucesso");
        setWasManuallyChanged(false);
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        toast.error("Não foi possível inserir o Fornecedor");

        if (
          context?.previousData &&
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        ) {
          queryClient.setQueryData(
            trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op }),
            context.previousData
          );
        }
      },
      onSettled: () => {
        if (trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
          );
        }
      },
    })
  );

  // CHANGE 2: Simplified effect with proper guards
  useEffect(() => {
    // Guard 1: Only proceed if user manually changed the value
    if (!wasManuallyChanged) return;

    // Guard 2: Don't proceed if there's an error or mutation is pending
    if (erro || isPending) return;

    // Parse the debounced value
    const parsed = NumeroOuZero.safeParse(debounced);

    // Guard 3: If parsing failed, reset to 0
    if (!parsed.success) {
      setRaw("0");
      setWasManuallyChanged(false);
      return;
    }

    const novo = parsed.data;

    // Guard 4: Handle non-parsable numbers
    if (!isParsableNumber(debounced)) {
      setRaw("0");
      setWasManuallyChanged(false);
      return;
    }

    // Guard 5: Skip if value is same as original
    if (valorOriginal !== undefined && novo === valorOriginal) {
      setWasManuallyChanged(false);
      return;
    }

    // Guard 6: Skip if this is the same value we just submitted
    if (lastSubmittedValue.current === novo) {
      setWasManuallyChanged(false);
      return;
    }

    // CHANGE 3: All guards passed, submit the mutation
    console.log("Submitting mutation:", { op, variavel, nQtt, qtt: novo });
    lastSubmittedValue.current = novo;
    insereQtt({ op, variavel, nQtt, qtt: novo });

    // CHANGE 4: Removed wasManuallyChanged from dependencies
    // The onSuccess callback will reset it
  }, [
    debounced,
    erro,
    isPending,
    valorOriginal,
    op,
    variavel,
    nQtt,
    insereQtt,
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
      className="
        w-32
        border-none
        focus:outline-none
        focus:ring-0
        px-0
        shadow-none
        appearance-none
        text-center
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
      "
      placeholder="Defeitos stock"
    />
  );
};

export default MutateQuantidade;
