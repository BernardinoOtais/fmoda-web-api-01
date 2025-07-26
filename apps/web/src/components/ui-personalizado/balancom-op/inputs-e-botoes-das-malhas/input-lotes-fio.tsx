import { StringPersonalizada } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type InputLotesFioProps = {
  op: number;
  idBm: string;
  ref: string;
  refOrigem: string;
  texto: string;
};

const InputLotesFio = ({
  op,
  idBm,
  ref,
  refOrigem,
  texto,
}: InputLotesFioProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [erro, setErro] = useState(false);

  const [raw, setRaw] = useState(texto);

  const debounced = useDebounce(raw, 1250);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  useEffect(() => {
    setRaw(texto);
    setWasManuallyChanged(false);
  }, [texto]);

  useEffect(() => {
    setErro(false);
  }, [debounced]);

  const { mutate: insereLote, isPending } = useMutation(
    trpc.qualidade_balancom_op.postBmLoteFio.mutationOptions({
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
                          lote: valor.texto,
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
      onError: (_error, _updatedEnvio, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.qualidade_balancom_op.getBmDataViaId.queryKey(idBm),
            context.previousData
          );
        }

        setErro(true);
        toast.error("Não foi possível inserir o lote...");
      },
      onSuccess: () => {
        toast.success("Lote inserido com sucesso...");
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

    const parsed = StringPersonalizada(4000).safeParse(debounced);
    if (!parsed.success) return;

    const novo = parsed.data;
    if (texto !== undefined && novo === texto) return;

    if (isPending || erro) return;

    insereLote({
      op: op,
      idBm: idBm,
      ref: ref,
      refOrigem: refOrigem,
      texto: novo,
    });
  }, [
    debounced,
    erro,
    idBm,
    insereLote,
    isPending,
    op,
    ref,
    refOrigem,
    texto,
    wasManuallyChanged,
  ]);

  const nLinhasCalculadas = raw === "" ? 1 : Math.ceil(raw.length / 22);

  return (
    <Textarea
      inputMode="text"
      disabled={isPending}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        setWasManuallyChanged(true);
      }}
      rows={nLinhasCalculadas}
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
        w-48
        min-h-auto
      "
      placeholder="Defeitos stock"
    />
  );
};

export default InputLotesFio;
