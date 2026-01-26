import { PacksDto } from "@repo/tipos/planeamento/lotes";
import { useMutation, useQueryClient } from "@repo/trpc";
import React from "react";
import { toast } from "sonner";

import TabelaTamanhosQtt from "./tabela-tamanhos-qtt";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

type PacksProps = {
  packs: PacksDto;
  bostamp: string;
  ref: string;
  op: number;
  numeroPecaCaixa: number;
  qttTamanhosAJuntar: number;
  user: string | undefined;
};
const Packs = ({
  packs,
  bostamp,
  ref,
  op,
  numeroPecaCaixa,
  qttTamanhosAJuntar,
  user,
}: PacksProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const mostraBotao = user === "Bernardino" || user === "Beatriz";
  const { mutate } = useMutation(
    trpc.planeamentoLotes.delteOpLotes.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.planeamentoLotes.getOpLotesDist.queryKey({
            Obrano: op,
            CaseCapacity: numeroPecaCaixa,
            MaxSizesPerCase: qttTamanhosAJuntar,
          }),
        });
        toast.info("Pack eliminado...", {
          description: "Sucesso",
        });
      },
    }),
  );

  return (
    <>
      <div className="w-full text-center">
        <span className="font-semibold  ">Packs</span>
      </div>
      {packs.map((p, id) => {
        const qtt = p.quantidades.reduce((acc, q) => acc + q.qtt, 0);
        return (
          <div key={p.idLote} className="flex flex-col">
            {mostraBotao && (
              <Button
                variant="ghost"
                className="
                w-28
                relative
                cursor-pointer
                hover:text-red-600
                hover:bg-red-50
                transition-colors
                group"
                onClick={() => mutate({ idLote: p.idLote, bostamp, ref })}
              >
                <span className="group-hover:hidden">{`Pack ${id + 1}`}</span>

                <span className="hidden group-hover:inline text-red-600">
                  {`Apaga Pack ${id + 1}`}
                </span>
              </Button>
            )}

            <span>{`${p.nLotesTotal} Lotes, cada lote ${qtt} peças, total peças = ${qtt * p.nLotesTotal}`}</span>
            {p.nLotesCaixa !== 0 && (
              <span>{`Lotes previstos por caixa = ${p.nLotesCaixa}, Número caixas previstas = ${Math.ceil(p.nLotesTotal / p.nLotesCaixa)}`}</span>
            )}

            <TabelaTamanhosQtt dados={p.quantidades} />
          </div>
        );
      })}
    </>
  );
};

export default Packs;
