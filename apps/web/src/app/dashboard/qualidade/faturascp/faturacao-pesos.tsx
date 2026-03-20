import { zodResolver } from "@hookform/resolvers/zod";
import { PostPesoBrutoEPesoLiquido } from "@repo/tipos/qualidade/faturascp";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

type PostPesoBrutoEPesoLiquidoDto = z.infer<typeof PostPesoBrutoEPesoLiquido>;

type FaturacaoPesosProps = {
  ftstamp: string;
  u_pnet: string;
  u_pbruto: string;
  ano: string;
  fatura: string;
};

const FaturacaoPesos = ({
  ftstamp,
  u_pnet,
  u_pbruto,
  ano,
  fatura,
}: FaturacaoPesosProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<PostPesoBrutoEPesoLiquidoDto>({
    resolver: zodResolver(PostPesoBrutoEPesoLiquido),
    defaultValues: {
      ftstamp,
      u_pnet,
      u_pbruto,
    },
  });

  useEffect(() => {
    form.reset({ ftstamp, u_pnet, u_pbruto });
  }, [ftstamp, u_pnet, u_pbruto, form]);

  const mutation = useMutation(
    trpc.faturasComnposicaoPbEPl.patchFaturasPeso.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.faturasComnposicaoPbEPl.getBmDadosParaCalculoComposicao.queryOptions(
            { ano, fatura },
          ),
        );
        form.reset({ ftstamp, u_pnet, u_pbruto });
        toast.success("Composiçāo alterardo com sucesso...");
      },
      onError: (err) => {
        toast.error("Não foi possível alterar a composiçāo...");
        console.error(err);
      },
    }),
  );

  const onSubmit = (data: PostPesoBrutoEPesoLiquidoDto) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap gap-4 items-end justify-center"
      >
        <FormField
          control={form.control}
          name="u_pnet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso Líquido</FormLabel>
              <FormControl>
                <Input
                  className="w-28"
                  {...field}
                  disabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="u_pbruto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso Bruto</FormLabel>
              <FormControl>
                <Input
                  className="w-40"
                  {...field}
                  disabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={mutation.isPending || !form.formState.isDirty}
          className="cursor-pointer"
        >
          {mutation.isPending ? "..." : "Insere pesos"}
        </Button>

        {mutation.isError && (
          <p className="text-sm text-red-500">Erro ao alterar...</p>
        )}
      </form>
    </Form>
  );
};

export default FaturacaoPesos;
