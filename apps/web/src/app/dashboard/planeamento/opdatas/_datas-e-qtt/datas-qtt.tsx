import { DataQttSchema } from "@repo/tipos/planeamento";
import { useMutation, useQueryClient } from "@repo/trpc";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import InsereDataQtt from "./insere-data-qtt";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type DatasQttProps = {
  dados: DataQttSchema[];
  op: number;
  bostamp: string;
  tipo: 2 | 3;
};
const DatasQtt = ({ dados, op, bostamp, tipo }: DatasQttProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [linhaSeleccionada, setLinhaSeleccionada] = useState<
    DataQttSchema | undefined
  >(undefined);

  const resetEscolha = () => setLinhaSeleccionada(undefined);

  //funcao deleteDataEQtt
  const { mutate: apagaData } = useMutation(
    trpc.planeamento.deleteDataEQtt.mutationOptions({
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
            if (!old || !Array.isArray(old)) return old;

            return old.map((opDados) => {
              if (opDados.op !== op) return opDados;

              if (tipo === 2) {
                return {
                  ...opDados,
                  dCamioes: opDados.dCamioes.filter(
                    (c) => c.idDataQtt !== valor.idDataQtt
                  ),
                };
              }

              if (tipo === 3) {
                return {
                  ...opDados,
                  dFaturas: opDados.dFaturas.filter(
                    (f) => f.idDataQtt !== valor.idDataQtt
                  ),
                };
              }

              return opDados;
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
    <div className="flex flex-col space-y-1 items-center border rounded-md p-1">
      {dados.map((linha, index) => {
        const formattedDate = format(linha.data, "dd/MM/yyyy");

        return (
          <Tooltip key={linha.idDataQtt}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex flex-row items-center justify-center space-x-1 rounded-md   hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border border-border shadow-sm px-3", // base styles
                  "hover:bg-muted hover:text-foreground", // hover effect
                  linhaSeleccionada?.idDataQtt === linha.idDataQtt &&
                    "bg-accent text-accent-foreground" // selected state
                )}
                onClick={(e) => {
                  e.stopPropagation();

                  setLinhaSeleccionada(
                    linha === linhaSeleccionada ? undefined : linha
                  );
                }}
              >
                <span>{`${tipo === 2 ? "Camião " : "Envio "} nº${index + 1} `}</span>

                <div className="inline-flex items-center gap-3 rounded-md px-3 py-1  ">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CalendarIcon
                          className="h-5 w-5 opacity-70 transition-colors hover:text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            apagaData({ idDataQtt: linha.idDataQtt });
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Apaga ${tipo === 2 ? "Camião " : "Envio "} nº${index + 1} `}</p>
                      </TooltipContent>
                    </Tooltip>

                    <span>{formattedDate}</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground text-center w-16">
                    {new Intl.NumberFormat("pt-PT").format(linha.qtt)}
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{`Altera ${tipo === 2 ? "Camião " : "Envio "} nº${index + 1} `}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
      <InsereDataQtt
        linhaSeleccionada={linhaSeleccionada}
        bostamp={bostamp}
        resetEscolha={resetEscolha}
        op={op}
        tipo={tipo}
      />
    </div>
  );
};

export default DatasQtt;
