import { CmrOuObsSchema } from "@repo/tipos/qualidade_balancom";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type InputCmrObsProps = {
  idBm: string;
  op: number;
  nFatutura: number;
  chave: "cmr" | "obs";
  valorOriginal: string;
};
const InputCmrObs = ({
  idBm,
  op,
  nFatutura,
  chave,
  valorOriginal,
}: InputCmrObsProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [raw, setRaw] = useState(valorOriginal ?? "");

  const [erro, setErro] = useState(false);

  const debounced = useDebounce(raw, 1250);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  useEffect(() => {
    setRaw(valorOriginal ?? "");
    setWasManuallyChanged(false);
  }, [valorOriginal]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: insereTexto, isPending } = useMutation(
    trpc.qualidade_balancom_op.postBmIdBmOpnFaturaCmrObs.mutationOptions({
      onMutate: async (valor) => {
        await queryClient.cancelQueries(
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
              BmOp: old.BmOp.map((bmOp) => {
                if (bmOp.op !== op) return bmOp;
                return {
                  ...bmOp,
                  BmOpFaturado: bmOp.BmOpFaturado?.map((fatura) => {
                    if (fatura.nFatutura !== nFatutura) return fatura;
                    return {
                      ...fatura,
                      [chave]: valor.valor,
                    };
                  }),
                };
              }),
            };
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        setErro(false);
        toast.success(
          chave === "cmr"
            ? "CMR inserido com sucesso..."
            : "OBS inserida com sucesso..."
        );
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        toast.error(
          chave === "cmr"
            ? "Não foi possível inserir o CMR..."
            : "Não foi possível inserir a OBS..."
        );
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

    const parsed = CmrOuObsSchema(chave).safeParse(debounced);

    if (!parsed.success) return;

    const novo = parsed.data;

    if (valorOriginal !== undefined && novo === valorOriginal) return;

    if (isPending || erro) return;

    insereTexto({
      op,
      idBm,
      nFatutura,
      chave,
      valor: novo,
    });
  }, [
    debounced,
    valorOriginal,
    insereTexto,
    chave,
    op,
    idBm,
    nFatutura,
    erro,
    isPending,
    wasManuallyChanged,
  ]);

  const nLinhasCalculadas = raw === "" ? 1 : Math.ceil(raw.length / 22);

  return (
    <Textarea
      inputMode="text"
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        setWasManuallyChanged(true);
      }}
      rows={nLinhasCalculadas}
      className={cn(
        "border-none",
        "focus:outline-none focus:ring-0",
        "px-0",
        "shadow-none appearance-none",
        "text-center",
        "w-48 min-h-0",
        "[&::-webkit-inner-spin-button]:appearance-none",
        "[&::-webkit-outer-spin-button]:appearance-none",
        {
          "w-40": chave === "cmr",
        }
      )}
      placeholder={chave === "cmr" ? "Cmr..." : "Obs..."}
    />
  );
};

export default InputCmrObs;
