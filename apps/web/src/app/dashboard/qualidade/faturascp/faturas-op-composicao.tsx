import { zodResolver } from "@hookform/resolvers/zod";
import { PostComposicaoSchema } from "@repo/tipos/qualidade/faturascp";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect } from "react";
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
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import { useTRPC } from "@/trpc/client";

type PostComposicaoDto = z.infer<typeof PostComposicaoSchema>;

type FaturasOpComposicaoProps = {
  dados: {
    opStamp: string;
    dadosOp: {
      obrano: number;
      cliente: string;
      design: string;
      cor: string;
      foto: string;
    };
    composicao: string;
  };
  ano: string;
  fatura: string;
};
//PostComposicaoSchema

const FaturasOpComposicao = ({
  dados,
  ano,
  fatura,
}: FaturasOpComposicaoProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<PostComposicaoDto>({
    resolver: zodResolver(PostComposicaoSchema),
    defaultValues: {
      opStamp: dados.opStamp,
      composicao: dados.composicao,
    },
  });

  useEffect(() => {
    form.reset({ opStamp: dados.opStamp, composicao: dados.composicao });
  }, [dados.composicao, dados.opStamp, form]);

  const mutation = useMutation(
    trpc.faturasComnposicaoPbEPl.patchFaturasComposicaoOp.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.faturasComnposicaoPbEPl.getBmDadosParaCalculoComposicao.queryOptions(
            { ano, fatura },
          ),
        );
        form.reset({ opStamp: dados.opStamp, composicao: dados.composicao });
        toast.success("Pesos alterardos com sucesso...");
      },
      onError: (err) => {
        toast.error("Não foi possível alterar Pesos...");
        console.error(err);
      },
    }),
  );

  const onSubmit = (data: PostComposicaoDto) => {
    mutation.mutate(data);
  };
  return (
    <div className="flex flex-col items-center">
      <span role="button" className=" ">
        Op: <span className="font-bold">{dados.dadosOp.obrano}</span>
      </span>

      <span className="">
        Cliente: <span className="font-bold">{dados.dadosOp.cliente}</span>
      </span>
      <span className="text-center ">{dados.dadosOp.design}</span>
      <span className="text-center ">
        Cor: <span className="font-bold">{dados.dadosOp.cor}</span>
      </span>
      {process.env.NODE_ENV === "production" && (
        <LazyFotoClient
          src={dados.dadosOp.foto || ""}
          alt="Foto Modelo"
          cssImage="w-40 h-40 object-contain rounded-md border border-border"
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="  w-full">
          <FormField
            control={form.control}
            name="composicao"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col items-start justify-center">
                <FormLabel>Composiçāo</FormLabel>
                <FormControl>
                  <div className="grid w-full">
                    <span className="invisible col-start-1 row-start-1 px-3 py-2 text-sm whitespace-nowrap min-w-20 border">
                      {field.value}
                    </span>
                    <Input
                      className="col-start-1 row-start-1 w-full"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={mutation.isPending || !form.formState.isDirty}
            className="cursor-pointer w-full"
          >
            {mutation.isPending ? "..." : "Insere composição"}
          </Button>

          {mutation.isError && (
            <p className="text-sm text-red-500">Erro ao guardar.</p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default FaturasOpComposicao;
