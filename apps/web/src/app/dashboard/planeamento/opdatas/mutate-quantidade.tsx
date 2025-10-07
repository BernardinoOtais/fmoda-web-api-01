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

  useEffect(() => {
    setRaw(valorOriginal.toString() ?? "");
    setWasManuallyChanged(false);
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
        toast.success("Quantidade inserida com sucesso...");
        setWasManuallyChanged(false);
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        setRaw(valorOriginal?.toString() ?? "");
        toast.error("Não foi possível inserir a Quantidade...");

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

  useEffect(() => {
    if (!wasManuallyChanged) return;

    const parsed = NumeroOuZero.safeParse(debounced);

    if (!parsed.success) return;

    const novo = parsed.data;

    if (!isParsableNumber(debounced) && !erro) {
      setRaw("0");
      return;
    }

    if (valorOriginal !== undefined && novo === valorOriginal) {
      return;
    }

    if (erro || isPending) return;
    insereQtt({ op, variavel, nQtt, qtt: novo });
  }, [
    debounced,
    erro,
    insereQtt,
    isPending,
    nQtt,
    op,
    valorOriginal,
    variavel,
    wasManuallyChanged,
  ]);

  //    insereQtt({ op, variavel, nQtt, qtt: novo });
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
