import { zodResolver } from "@hookform/resolvers/zod";
import { ComposicaoResultanteDados } from "@repo/tipos/qualidade_balancom_composicao";
import { useMutation, useQueryClient } from "@repo/trpc";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatNCasasDecimais } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type DataItem = {
  composicao: string;
  idComposicao: number;
  composicaoAbreviatura: string;
  ordem: number;
  qtt: number;
};

type ComposicaoResultanteProps = {
  dataItens: DataItem[];
  idBm: string;
  op: number;
};

const ComposicaoResultante = ({
  dataItens,
  idBm,
  op,
}: ComposicaoResultanteProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate: insereComposicaoFinal, isPending } = useMutation(
    trpc.qualidade_balancom_op_composicao.postComposicaoFinal.mutationOptions({
      onMutate: async (valor) => {
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
              composicao: valor.composicao,
            };
          }
        );
        return { previousData };
      },
      onSuccess: () => {
        toast.success("Composição inserida com sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
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
        router.push(`/dashboard/qualidade/balancom/${op}`);
      },
    })
  );
  const form = useForm<z.infer<typeof ComposicaoResultanteDados>>({
    resolver: zodResolver(ComposicaoResultanteDados),
    defaultValues: {
      idBm,
      ComposicoesTratadas: dataItens.map((dado) => {
        const percentagem = formatNCasasDecimais(dado.qtt, 0);
        const qtt = percentagem === "0" && dado.qtt > 0 ? "1" : percentagem;
        return {
          idComposicao: dado.idComposicao,
          composicao: dado.composicao,
          composicaoAbreviatura: dado.composicaoAbreviatura,
          ordem: dado.ordem,
          qtt,
        };
      }),
    },
  });

  const { control, setValue } = form;

  useEffect(() => {
    dataItens.forEach((dado, indice) => {
      const percentagem = formatNCasasDecimais(dado.qtt, 0);
      const qtt = percentagem === "0" && dado.qtt > 0 ? "1" : percentagem;
      setValue(`ComposicoesTratadas.${indice}`, {
        idComposicao: dado.idComposicao,
        composicao: dado.composicao,
        composicaoAbreviatura: dado.composicaoAbreviatura,
        ordem: dado.ordem,
        qtt,
      });
    });
  }, [dataItens, setValue]);

  const reset = () => {
    dataItens.forEach((dado, indice) => {
      const percentagem = formatNCasasDecimais(dado.qtt, 0);
      const qtt = percentagem === "0" && dado.qtt > 0 ? "1" : percentagem;
      setValue(`ComposicoesTratadas.${indice}`, {
        idComposicao: dado.idComposicao,
        composicao: dado.composicao,
        composicaoAbreviatura: dado.composicaoAbreviatura,
        ordem: dado.ordem,
        qtt,
      });
    });
  };
  const total = useWatch({
    control,
    name: "ComposicoesTratadas",
  });

  const [somaPercentagem, setSomaPercentagem] = useState(0);

  useEffect(() => {
    setSomaPercentagem(calculateSum(total));
  }, [total]);
  const onSubmit = async (data: z.infer<typeof ComposicaoResultanteDados>) => {
    const dados =
      data.ComposicoesTratadas?.map((dado) => {
        return {
          idComposicao: dado.idComposicao,
          composicao: dado.composicao,
          composicaoAbreviatura: dado.composicaoAbreviatura,
          ordem: dado.ordem,
          qtt: dado.qtt,
        };
      }) || [];

    const composicaoCalc = percentragemCalculada(dados);
    const valorParaPost = {
      idBm,
      op: op.toString(),
      composicao: composicaoCalc || "",
    };
    insereComposicaoFinal(valorParaPost);
  };
  if (somaPercentagem === 0) return null;

  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
        Composição Resultante
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-1"
        >
          <div className="flex flex-row space-x-1 items-end">
            {total?.map((comp, indice) => {
              return (
                <div key={comp.idComposicao}>
                  {comp.qtt !== "0" && (
                    <>
                      <FormField
                        control={form.control}
                        name={`ComposicoesTratadas.${indice}.qtt`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="">
                              <div className="mx-auto">
                                <span>%</span>
                                <span className="pr-2">
                                  {comp?.composicaoAbreviatura}
                                </span>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="w-24"
                                {...field}
                                autoFocus
                                disabled={isPending}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              );
            })}
            <span className="w-20">{` = ${somaPercentagem} %`}</span>
            <Button
              type="button"
              className="cursor-pointer"
              disabled={isPending}
              onClick={() => {
                reset();
              }}
            >
              Reset
            </Button>
          </div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
            Composição calculada
          </h3>
          <span className="font-semibold">{percentragemCalculada(total)}</span>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={somaPercentagem !== 100 || isPending}
          >
            Grava Composição...
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ComposicaoResultante;
const calculateSum = (
  items:
    | {
        idComposicao: number;
        composicao: string;
        composicaoAbreviatura: string;
        ordem: number;
        qtt: string;
      }[]
    | undefined
) => items?.reduce((total, item) => total + parseInt(item.qtt), 0) ?? 0;

const percentragemCalculada = (
  dados:
    | {
        idComposicao: number;
        composicao: string;
        composicaoAbreviatura: string;
        ordem: number;
        qtt: string;
      }[]
    | undefined
) => {
  const resultado = dados
    ?.filter((item) => item !== undefined && item.qtt !== "0")
    .reduce((acc, item) => {
      if (item) acc += `${item.qtt}% ${item.composicaoAbreviatura} `;
      return acc;
    }, "");

  return resultado;
};
