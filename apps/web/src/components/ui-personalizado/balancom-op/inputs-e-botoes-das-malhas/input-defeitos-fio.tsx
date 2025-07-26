import { NumeroOuZero } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { isParsableNumber } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type InputDefeitosFioProps = {
  idBm: string;
  ref: string;
  refOrigem: string;
  defeitosStock: number;
};

const InputDefeitosFio = ({
  idBm,
  ref,
  refOrigem,
  defeitosStock,
}: InputDefeitosFioProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [raw, setRaw] = useState(defeitosStock?.toString() ?? "");

  const [erro, setErro] = useState(false);

  const debounced = useDebounce(raw, 1250);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  useEffect(() => {
    setRaw(defeitosStock.toString() ?? "");
    setWasManuallyChanged(false);
  }, [defeitosStock]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: insereDefeito, isPending } = useMutation(
    trpc.qualidade_balancom_op.postBmDefeitoFio.mutationOptions({
      onMutate: async (valor) => {
        setErro(false);
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
              BmMalhas: old.BmMalhas.map((bm) => {
                if (!bm.BmMalhasFio) return bm;

                return {
                  ...bm,
                  BmMalhasFio: bm.BmMalhasFio.map((bmf) =>
                    bmf.refOrigem === refOrigem && bmf.ref === ref
                      ? {
                          ...bmf,
                          defeitosStock: valor.defeitosStock as number,
                        }
                      : bmf
                  ),
                };
              }),
            };
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Defeitos inseridos com sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        toast.error("Não foi possível inserir os defeitos...");
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

  useEffect(() => {
    if (!wasManuallyChanged) return;

    const parsed = NumeroOuZero.safeParse(debounced);

    if (!parsed.success) return;

    const novo = parsed.data;

    if (!isParsableNumber(debounced) && !erro) {
      setRaw("0");
      return;
    }

    if (defeitosStock !== undefined && novo === defeitosStock) {
      return;
    }

    if (erro || isPending) return;

    insereDefeito({
      idBm,
      op: "",
      ref,
      refOrigem,
      defeitosStock: novo,
    });
  }, [
    debounced,
    defeitosStock,
    erro,
    idBm,
    insereDefeito,
    isPending,
    raw,
    ref,
    refOrigem,
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
      className="
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

export default InputDefeitosFio;
