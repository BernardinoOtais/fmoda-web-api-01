import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { EnviosListDto } from "@repo/tipos/embarques";
import { TRPCError, useMutation, useQueryClient } from "@repo/trpc";
import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type BotaoApagaEnvioProps = {
  idenvio: number;
  disabledBotao: boolean;
  setDisabledBotao: (data: boolean) => void;
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
};
const BotaoApagaEnvio = ({
  idenvio,
  disabledBotao,
  setDisabledBotao,
  dadosIniciais,
}: BotaoApagaEnvioProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const apagaEnvio = useMutation(
    trpc.deleteEnvio.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Envio ${data.data.idEnvio} apagado`, {
          description: data.message || "Sucesso",
        });
      },
      onMutate: async (updatedEnvio) => {
        await queryClient.cancelQueries(
          trpc.getEnviosAcessorios.queryOptions(dadosIniciais)
        );

        const previousData = queryClient.getQueryData<EnviosListDto>(
          trpc.getEnviosAcessorios.queryKey(dadosIniciais)
        );

        if (!previousData) return { previousData: null };

        queryClient.setQueryData(
          trpc.getEnviosAcessorios.queryKey(dadosIniciais),
          {
            ...previousData,
            lista: previousData.lista.filter(
              (envio) => envio.idEnvio !== updatedEnvio.idEnvio
            ),
          }
        );

        return { previousData };
      },

      onError: (_error, _updatedEnvio, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.getEnviosAcessorios.queryKey(dadosIniciais),
            context.previousData
          );
        }
        toast.error(`Erro ao apagar Envio: ${idenvio}`, {
          description:
            _error instanceof TRPCError
              ? _error.message
              : _error instanceof Error
                ? _error.message
                : "Erro desconhecido",
        });
      },

      onSettled: () => {
        setDisabledBotao(false);
        queryClient.invalidateQueries(
          trpc.getEnviosAcessorios.queryOptions(dadosIniciais)
        );
      },
    })
  );

  return (
    <Button
      size="icon"
      disabled={disabledBotao}
      onClick={() => {
        setDisabledBotao(true);
        apagaEnvio.mutate({ idEnvio: idenvio });
      }}
      className={cn(
        "relative flex items-center justify-center" // Default classes
      )}
      title="Apaga Container"
    >
      {disabledBotao && <Loader2 className="absolute animate-spin" />}
      {!disabledBotao && <Trash2 />}
    </Button>
  );
};

export default BotaoApagaEnvio;
