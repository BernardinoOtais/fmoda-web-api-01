import { NumeroOuZero } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { isParsableNumber } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type ImputPesosLiquidoEBrutoPorps = {
  idBm: string;
  op: number;
  nFatutura: number;
  chave: "pesoBruto" | "pesoLiquido";
  pesoOriginal: number;
};
const ImputPesosLiquidoEBruto = ({
  idBm,
  op,
  nFatutura,
  chave,
  pesoOriginal,
}: ImputPesosLiquidoEBrutoPorps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [raw, setRaw] = useState(pesoOriginal?.toString() ?? "");

  const [erro, setErro] = useState(false);

  const debounced = useDebounce(raw, 1250);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  useEffect(() => {
    setRaw(pesoOriginal.toString() ?? "");
    setWasManuallyChanged(false);
  }, [pesoOriginal]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: inserePeso, isPending } = useMutation(
    trpc.qualidade_balancom_op.postBmIdBmOpnFaturaPesoLisquidoPesoBruto.mutationOptions(
      {
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
          toast.success(
            chave === "pesoBruto"
              ? "Peso bruto inserido com sucesso..."
              : "Peso líquido com sucesso..."
          );
        },
        onError: (_error, _updatedEnvio, context) => {
          setErro(true);
          toast.error(
            chave === "pesoBruto"
              ? "Não foi possível inserir o peso bruto..."
              : "Não foi possível inserir o peso líquido..."
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
      }
    )
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

    if (pesoOriginal !== undefined && novo === pesoOriginal) return;

    if (erro || isPending) return;

    inserePeso({
      op,
      idBm,
      nFatutura,
      chave,
      valor: novo,
    });
  }, [
    debounced,
    pesoOriginal,
    inserePeso,
    erro,
    op,
    idBm,
    nFatutura,
    chave,
    isPending,
    wasManuallyChanged,
  ]);

  return (
    <Input
      inputMode="text"
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        setWasManuallyChanged(true);
      }}
      className="
        mx-auto
        w-20
        h-6
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

export default ImputPesosLiquidoEBruto;
