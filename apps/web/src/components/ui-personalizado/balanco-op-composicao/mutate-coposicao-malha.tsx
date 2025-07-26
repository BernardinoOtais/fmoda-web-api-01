import { NumeroOuZero } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { isParsableNumber } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type MutateComposicaoMalhaProps = {
  op: number;
  idBm: string;
  ref: string;
  idComposicao: number;
  valorOriginal: number;
};

const MutateComposicaoMalha = ({
  op,
  idBm,
  ref,
  idComposicao,
  valorOriginal,
}: MutateComposicaoMalhaProps) => {
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

  const { mutate: insereComposicao, isPending } = useMutation(
    trpc.qualidade_balancom_op_composicao.postBmNovoOuAlteroComposicao.mutationOptions(
      {
        onMutate: async (valor) => {
          setErro(false);
          await queryClient.cancelQueries(
            trpc.qualidade_balancom_op_composicao.getBmDadosParaCalculoComposicao.queryOptions(
              { op }
            )
          );

          const previousData = queryClient.getQueryData(
            trpc.qualidade_balancom_op_composicao.getBmDadosParaCalculoComposicao.queryKey(
              { op }
            )
          );
          queryClient.setQueryData(
            trpc.qualidade_balancom_op_composicao.getBmDadosParaCalculoComposicao.queryKey(
              { op }
            ),
            (old) => {
              if (!old?.BmMalhas) return old;

              return {
                ...old,
                BmMalhas: old.BmMalhas.map((bm) => {
                  if (!bm) return bm;

                  if (bm.ref === ref) {
                    return {
                      ...bm,
                      composicao: bm.composicao.map((comp) =>
                        comp.idComposicao === idComposicao
                          ? { ...comp, qtt: valor.qtt }
                          : comp
                      ),
                    };
                  }

                  return bm;
                }),
              };
            }
          );
          return { previousData };
        },
        onSuccess: () => {
          toast.success("Composição inserida com sucesso...");
        },
        onError: (_error, _updatedEnvio, context) => {
          setErro(true);
          toast.error("Não foi possível inserir os composição...");
          if (context?.previousData) {
            queryClient.setQueryData(
              trpc.qualidade_balancom_op_composicao.getBmDadosParaCalculoComposicao.queryKey(
                { op }
              ),
              context.previousData
            );
          }
        },
        onSettled: () => {
          queryClient.invalidateQueries(
            trpc.qualidade_balancom_op_composicao.getBmDadosParaCalculoComposicao.queryOptions(
              { op }
            )
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

    if (valorOriginal !== undefined && novo === valorOriginal) {
      return;
    }

    if (erro || isPending) return;

    insereComposicao({
      op: op.toString(),
      idBm,
      ref: ref,
      idComposicao: idComposicao,
      qtt: novo,
    });
  }, [
    debounced,
    erro,
    idBm,
    idComposicao,
    insereComposicao,
    isPending,
    op,
    ref,
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
export default MutateComposicaoMalha;
