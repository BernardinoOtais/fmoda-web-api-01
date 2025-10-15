import { useMutation, useQueryClient } from "@repo/trpc";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import InsereDataEQuantidade from "./insere-data-quantidade";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type DatasQuantidadesProps = {
  op: number;
  dados: {
    n: number;
    dataIn: Date;
    valor: number;
  }[];
  variavelD: "u_datafor" | "u_datacam";
  variavelQ: "u_camqtt" | "u_dfqtt";
};
const DatasQuantidades = ({
  op,
  dados,
  variavelD,
  variavelQ,
}: DatasQuantidadesProps) => {
  ///const data = format(new Date(), "dd/MM/yyyy")
  const [data, setData] = useState<Date | undefined>(undefined);
  const [qtt, setQtt] = useState<number | undefined>(undefined);
  const [n, setN] = useState<number | undefined>(undefined);

  const reset = () => {
    setData(undefined);
    setQtt(undefined);
    setN(undefined);
  };
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: apagaPlaneamento } = useMutation(
    trpc.planeamento.deleteDataEQuantidade.mutationOptions({
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
                camioes:
                  variavelD === "u_datacam"
                    ? opDados.camioes
                        .filter((c) => c.n !== valor.nTipo)
                        .sort((a, b) => a.dataIn.getTime() - b.dataIn.getTime())
                    : opDados.camioes,

                envios:
                  variavelD === "u_datafor"
                    ? opDados.envios
                        .filter((e) => e.n !== valor.nTipo)
                        .sort((a, b) => a.dataIn.getTime() - b.dataIn.getTime())
                    : opDados.envios,
              };
            });
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Planeamento eliminiado com sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
        toast.error("Error ao eliminar Planeamento...");

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
        reset();
        if (trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
          );
        }
      },
    })
  );

  const lista = dados.filter(
    (l) => format(l.dataIn, "dd/MM/yyyy") !== "01/01/1900"
  );
  //apaga deleteDataEQuantidadeBd
  return (
    <div className="flex flex-col space-y-1 items-center border rounded-md p-1">
      {lista.map((linha) => {
        const formattedDate = format(linha.dataIn, "dd/MM/yyyy");

        return (
          <Tooltip key={linha.n}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex flex-row items-center justify-center space-x-1 rounded-md   hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border border-border shadow-sm px-3", // base styles
                  "hover:bg-muted hover:text-foreground", // hover effect
                  n === linha.n && "bg-accent text-accent-foreground" // selected state
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setData(linha.dataIn);
                  setQtt(linha.valor);
                  setN(linha.n);
                }}
              >
                <span>{`${variavelD === "u_datacam" ? "Camião " : "Envio "} nº${linha.n} `}</span>

                <div className="inline-flex items-center gap-3 rounded-md px-3 py-1  ">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CalendarIcon
                          className="h-5 w-5 opacity-70 transition-colors hover:text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            apagaPlaneamento({
                              op,
                              tipoD: variavelD,
                              tipoQ: variavelQ,
                              nTipo: linha.n,
                            });
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Apaga ${variavelD === "u_datacam" ? "Camião " : "Envio "} nº${linha.n} `}</p>
                      </TooltipContent>
                    </Tooltip>

                    <span>{formattedDate}</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground text-center w-16">
                    {new Intl.NumberFormat("pt-PT").format(linha.valor)}
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{`Altera ${variavelD === "u_datacam" ? "Camião " : "Envio "} nº${linha.n} `}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
      {lista.length < 6 && (
        <InsereDataEQuantidade
          defaultDate={data}
          defaulQtt={qtt}
          n={n}
          op={op}
          variavelD={variavelD}
          variavelQ={variavelQ}
          resetDados={reset}
        />
      )}
    </div>
  );
};

export default DatasQuantidades;
