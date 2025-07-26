import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

type AbreOuFechaBmProps = {
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
  idBm: string;
  estadoInicial: boolean;
};
const AbreOuFechaBm = ({
  dadosIniciais,
  idBm,
  estadoInicial,
}: AbreOuFechaBmProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { mutate: abroOuFecho, isPending } = useMutation(
    trpc.qualidadeBalancoM.postAbroOuFechoBm.mutationOptions({
      onMutate: (valor) => {
        queryClient.cancelQueries(
          trpc.qualidadeBalancoM.getBms.queryOptions(dadosIniciais)
        );
        const previousData = queryClient.getQueryData(
          trpc.qualidadeBalancoM.getBms.queryKey(dadosIniciais)
        );
        queryClient.setQueryData(
          trpc.qualidadeBalancoM.getBms.queryKey(dadosIniciais),
          (old) => {
            if (!old?.lista) return old;
            return {
              ...old,
              lista: old.lista.filter((l) => l.idBm !== valor.idBm),
            };
          }
        );
        return { previousData };
      },
      onSuccess: () => {
        toast.success("Sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.qualidadeBalancoM.getBms.queryKey(dadosIniciais),
            context.previousData
          );
        }

        toast.error("Erro...");
      },
      onSettled: () => {
        queryClient
          .getQueryCache()
          .findAll()
          .forEach((query) => {
            const queryKey = query.queryKey;
            if (
              Array.isArray(queryKey) &&
              Array.isArray(queryKey[0]) &&
              queryKey[0][1] === "getBms" &&
              typeof queryKey[1] === "object" &&
              queryKey[1] !== null &&
              "input" in queryKey[1]
            ) {
              const input = queryKey[1]
                .input as DadosParaPesquisaComPaginacaoEOrdemDto;
              queryClient.invalidateQueries(
                trpc.qualidadeBalancoM.getBms.queryOptions(input)
              );
            }
            //Refresh NovoBalancoMassas
            if (
              Array.isArray(queryKey) &&
              Array.isArray(queryKey[0]) &&
              queryKey[0][1] === "getPrimeiroBmPorOp" &&
              typeof queryKey[1] === "object" &&
              queryKey[1] !== null &&
              "input" in queryKey[1]
            ) {
              const input = queryKey[1].input as { op: number };

              if (!input.op) return;

              queryClient.invalidateQueries(
                trpc.qualidadeBalancoM.getPrimeiroBmPorOp.queryOptions(input)
              );
            }
          });
      },
    })
  );

  return (
    <Button
      type="button"
      size="icon"
      disabled={isPending}
      onClick={() => abroOuFecho({ idBm })}
      className="relative flex items-center justify-center cursor-pointer group"
    >
      {/* Default icon */}
      <span className="group-hover:hidden">
        {estadoInicial ? <LockKeyhole /> : <LockKeyholeOpen />}
      </span>

      {/* Hover icon */}
      <span className="hidden group-hover:inline">
        {estadoInicial ? <LockKeyholeOpen /> : <LockKeyhole />}
      </span>

      {/* Overlay loader when pending */}
      {isPending && (
        <Loader2 className="absolute animate-spin text-muted-foreground" />
      )}
    </Button>
  );
};

export default AbreOuFechaBm;
