import { NumeroOuZero } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { isParsableNumber } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type InputQuantidadeSeUnidadeProps = {
  idBm: string;
  ref: string;
  qtdeEntradaSeUnidade: number;
};
const InputQuantidadeSeUnidade = ({
  idBm,
  ref,
  qtdeEntradaSeUnidade,
}: InputQuantidadeSeUnidadeProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [raw, setRaw] = useState(qtdeEntradaSeUnidade?.toString() ?? "");

  const [erro, setErro] = useState(false);

  const debounced = useDebounce(raw, 1250);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  useEffect(() => {
    setRaw(qtdeEntradaSeUnidade.toString() ?? "");
    setWasManuallyChanged(false);
  }, [qtdeEntradaSeUnidade]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: insereQuantidadeSeUnidade, isPending } = useMutation(
    trpc.qualidade_balancom_op.postBmQuantidadeSeUnidade.mutationOptions({
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
              BmMalhas: old.BmMalhas.map((item) =>
                item.idBm === idBm && item.ref === ref
                  ? {
                      ...item,
                      qtdeEntradaSeUnidade:
                        valor.qtdeEntradaSeUnidade as number,
                    }
                  : item
              ),
            };
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Quantidade inserida com sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        toast.error("Não foi possível inserir a quantidade...");
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

    if (qtdeEntradaSeUnidade !== undefined && novo === qtdeEntradaSeUnidade) {
      return;
    }

    if (erro || isPending) return;

    insereQuantidadeSeUnidade({
      idBm,
      ref,
      op: "",
      qtdeEntradaSeUnidade: novo,
    });
  }, [
    debounced,
    erro,
    idBm,
    insereQuantidadeSeUnidade,
    isPending,
    qtdeEntradaSeUnidade,
    ref,
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
      placeholder="Peso Unit"
    />
  );
};

export default InputQuantidadeSeUnidade;
