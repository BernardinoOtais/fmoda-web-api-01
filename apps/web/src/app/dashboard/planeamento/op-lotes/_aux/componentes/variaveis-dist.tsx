import {
  DistPorCaixaDto,
  PostdistPorCaixaSchema,
} from "@repo/tipos/planeamento/lotes";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";

type VariaveisDistProps = {
  distPorCaixa: DistPorCaixaDto;
  bostamp: string;
  op: number;
  setNumeroPecaCaixa: (dados: number | "") => void;
  debouncedNumeroPecaCaixa: number | "";
  numeroPecaCaixa: number | "";
  setQttTamanhosAJuntar: (dados: number | "") => void;
  debouncedQttTamanhosAJuntar: number | "";
  qttTamanhosAJuntar: number | "";
};
const VariaveisDist = ({
  distPorCaixa,
  bostamp,
  op,
  setNumeroPecaCaixa,
  debouncedNumeroPecaCaixa,
  numeroPecaCaixa,
  setQttTamanhosAJuntar,
  debouncedQttTamanhosAJuntar,
  qttTamanhosAJuntar,
}: VariaveisDistProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { mutate, isPending, isError } = useMutation(
    trpc.planeamentoLotes.upsertOpLotes.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.planeamentoLotes.getOpLotesPedido.queryOptions({
            op,
          }),
        );
      },
    }),
  );

  useEffect(() => {
    const valor = PostdistPorCaixaSchema.safeParse({
      bostamp,
      numeroPecaCaixa: debouncedNumeroPecaCaixa,
      qttTamanhosAJuntar: debouncedQttTamanhosAJuntar,
    });

    // Check if debounced values differ from the original distPorCaixa data
    if (
      valor.success &&
      (valor.data.numeroPecaCaixa !== distPorCaixa?.numeroPecaCaixa ||
        valor.data.qttTamanhosAJuntar !== distPorCaixa?.qttTamanhosAJuntar)
    ) {
      mutate(valor.data);
    }
  }, [
    bostamp,
    debouncedNumeroPecaCaixa,
    debouncedQttTamanhosAJuntar,
    distPorCaixa?.numeroPecaCaixa,
    distPorCaixa?.qttTamanhosAJuntar,
    mutate,
  ]);

  if (isError) return <div>Erro..</div>;
  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-row space-x-1 items-center mx-auto">
          <Label htmlFor="op">Número de peças por caixa:</Label>
          <Input
            disabled={isPending}
            className="w-28"
            value={numeroPecaCaixa}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                setNumeroPecaCaixa("");
                return;
              }

              const parsed = Number(value);
              if (Number.isInteger(parsed) && parsed >= 0) {
                setNumeroPecaCaixa(parsed);
              }
            }}
          />
        </div>
        <div className="flex flex-row space-x-1 items-center mx-auto">
          <Label htmlFor="op">Número de tamanhos a juntar:</Label>
          <Input
            disabled={isPending}
            className="w-28"
            id="op"
            value={qttTamanhosAJuntar}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                setQttTamanhosAJuntar(""); // or null if your schema allows it
                return;
              }

              const parsed = Number(value);

              if (Number.isInteger(parsed) && parsed >= 0) {
                setQttTamanhosAJuntar(parsed);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default VariaveisDist;
