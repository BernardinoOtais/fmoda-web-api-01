"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BmTcDto, BmTcSchema } from "@repo/tipos/qualidade_balancom";
import { useMutation, useQueryClient, useSuspenseQuery } from "@repo/trpc";
import { Loader2Icon, Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

type TCsssProps = {
  idBm: string;
};

const TCsss = ({ idBm }: TCsssProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useSuspenseQuery(
    trpc.qualidade_balancom_op.getTcsss.queryOptions(idBm)
  );
  const form = useForm<BmTcDto>({
    resolver: zodResolver(BmTcSchema),
    defaultValues: { idBm, nomeTc: "" },
  });

  const insereTc = useMutation(
    trpc.qualidade_balancom_op.postTcNovo.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries(
          trpc.qualidade_balancom_op.getTcsss.queryOptions(idBm)
        );
        const previousData = queryClient.getQueryData(
          trpc.qualidade_balancom_op.getTcsss.queryKey(idBm)
        );
        queryClient.setQueryData(
          trpc.qualidade_balancom_op.getTcsss.queryKey(idBm),
          (old: BmTcDto[] | undefined) =>
            old
              ? [...old, data].sort((a, b) => a.nomeTc.localeCompare(b.nomeTc))
              : [data]
        );
        return { previousData };
      },
      onError: (_error, _updatedEnvio, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.qualidade_balancom_op.getTcsss.queryKey(idBm),
            context.previousData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.qualidade_balancom_op.getTcsss.queryOptions(idBm)
        );
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.qualidade_balancom_op.deleteTc.mutationOptions({
      onMutate: async (itemToDelete) => {
        await queryClient.cancelQueries(
          trpc.qualidade_balancom_op.getTcsss.queryOptions(idBm)
        );
        const previousData = queryClient.getQueryData(
          trpc.qualidade_balancom_op.getTcsss.queryKey(idBm)
        );
        queryClient.setQueryData(
          trpc.qualidade_balancom_op.getTcsss.queryKey(idBm),
          (old: BmTcDto[] | undefined) =>
            old?.filter(
              (c) =>
                !(
                  c.idBm === itemToDelete.idBm &&
                  c.nomeTc === itemToDelete.nomeTc
                )
            ) ?? []
        );
        return { previousData };
      },
      onError: (_error, _updatedEnvio, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.qualidade_balancom_op.getTcsss.queryKey(idBm),
            context.previousData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.qualidade_balancom_op.getTcsss.queryOptions(idBm)
        );
      },
    })
  );

  const isSubmitting = form.formState.isSubmitting;

  const isPending = insereTc.isPending;
  const { reset } = form;
  const onSubmit = async (bmTcDto: BmTcDto) => {
    insereTc.mutate(bmTcDto);
    reset();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Erro...</div>;

  return (
    <>
      <div className="mt-4 space-y-1 text-sm">
        <ul className="list-disc list-inside space-y-1 text-sm pb-1">
          {data?.map((tc, index) => (
            <li className="text-left" key={index}>
              {apagaTc(
                tc.nomeTc,
                () => deleteMutation.mutate(tc),
                false,
                false
              )}
            </li>
          ))}
        </ul>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="nomeTc"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input
                      className="w-52"
                      placeholder="Op.."
                      {...field}
                      value={field.value ?? ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    className="cursor-pointer"
                    size="icon"
                    type="submit"
                    disabled={isSubmitting || isPending}
                  >
                    {(isSubmitting || isPending) && (
                      <Loader2Icon className="animate-spin" />
                    )}
                    <Plus />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default TCsss;

const apagaTc = (
  nome: string,
  apagoConteudoFun: () => void,
  disabledApaga: boolean,
  estaSelecionado: boolean
) => {
  return (
    <Button
      className="group hover:bg-primary/40 relative m-0 h-5 cursor-pointer p-0"
      variant="ghost"
      onClick={apagoConteudoFun}
      name={
        estaSelecionado ? "Remove selecção..." : "Selecciona para apagar..."
      }
      disabled={disabledApaga}
    >
      <span>{nome}</span>
      <Badge
        variant={estaSelecionado ? "default" : "destructive"}
        className="absolute top-[-10px] right-[-15px] hidden h-5 w-5 items-center justify-center rounded-full text-xs font-bold group-hover:flex"
      >
        {estaSelecionado ? "-" : "x"}
      </Badge>
    </Button>
  );
};
