"use client";
import { FornecedorValorDto } from "@repo/tipos/planeamento";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import InsereFornecedoresEPreco from "./insere-fornecedores-e-preco";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
//deleteFornecedorValorizado
type MutateFornecedoresValoresProps = {
  dados: FornecedorValorDto[];
  op: number;
  bostamp: string;
};
const MutateFornecedoresValores = ({
  dados,
  op,
  bostamp,
}: MutateFornecedoresValoresProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [linhaSeleccionada, setLinhaSeleccionada] = useState<
    FornecedorValorDto | undefined
  >(undefined);

  const resetEscolha = () => setLinhaSeleccionada(undefined);
  const { mutate: apagaFornecedorValorizado } = useMutation(
    trpc.planeamento.deleteFornecedorValorizado.mutationOptions({
      onMutate: async (valor) => {
        await queryClient.cancelQueries(
          trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
        );

        const previousData = queryClient.getQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        );
        queryClient.setQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op }),
          (old) => {
            if (!old) return old;

            return old.map((opDados) => {
              if (opDados.op !== op) return opDados;

              return {
                ...opDados,
                fornecedorValor: opDados.fornecedorValor.filter(
                  (f) => f.idValorizado !== valor.idValorizado
                ),
              };
            });
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Eliminiado com sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
        toast.error("Error ao eliminar...");

        if (
          context?.previousData &&
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        ) {
          queryClient.setQueryData(
            trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op }),
            context.previousData
          );
        }
      },
      onSettled: () => {
        //reset();
        if (trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
          );
        }
      },
    })
  );

  return (
    <div className="flex flex-col space-y-1 items-start border rounded-md p-1 w-full">
      {dados.map((linha, index) => {
        return (
          <Tooltip key={linha.idValorizado}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex flex-row items-center space-x-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border border-border shadow-sm px-3 w-full",
                  "hover:bg-muted hover:text-foreground",
                  linhaSeleccionada?.idValorizado === linha.idValorizado &&
                    "bg-accent text-accent-foreground "
                )}
                onClick={(e) => {
                  e.stopPropagation();

                  setLinhaSeleccionada(
                    linha === linhaSeleccionada ? undefined : linha
                  );
                }}
              >
                {/* INNER: make this take the remaining space */}
                <div className="flex items-center gap-3 flex-1 min-w-0 rounded-md px-3 py-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          className="h-5 w-5 opacity-70 transition-colors hover:text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            apagaFornecedorValorizado({
                              idValorizado: linha.idValorizado,
                            });
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Apaga ${linha.nome} `}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* SPAN: grow and truncate */}
                  <span className="flex-1">{linha.nome}</span>

                  <div className="text-sm font-semibold text-foreground text-center w-16">
                    {new Intl.NumberFormat("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(linha.valorServico)}
                  </div>
                </div>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p>{`Altera nº${index + 1} `}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
      <InsereFornecedoresEPreco
        linhaSeleccionada={linhaSeleccionada}
        bostamp={bostamp}
        resetEscolha={resetEscolha}
        op={op}
      />
    </div>
  );
};

export default MutateFornecedoresValores;
