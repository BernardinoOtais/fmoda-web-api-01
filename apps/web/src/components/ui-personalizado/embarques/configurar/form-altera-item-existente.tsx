"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PatchItemSchema,
  PatchItemSchemaDto,
} from "@repo/tipos/embarques_configurar";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

type FormAlteraItemExistentProps = {
  dados: PatchItemSchemaDto;
};
const FormAlteraItemExistent = ({ dados }: FormAlteraItemExistentProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();
  const [botaoAlteraItemDisabled, setBotaoAlteraItemDisabled] = useState(true);
  const [botaoIsloading, setBotaoIsloading] = useState(false);

  const form = useForm<PatchItemSchemaDto>({
    resolver: zodResolver(PatchItemSchema),
    defaultValues: dados,
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const dados = PatchItemSchema.safeParse(values);

      if (!dados.success) return;
      setBotaoAlteraItemDisabled(true);

      const valoresNoForEmString = JSON.stringify(values);
      const dadosOriginaisEmString = JSON.stringify(dados);

      if (valoresNoForEmString === dadosOriginaisEmString) return;

      setBotaoAlteraItemDisabled(false);
    });

    return unsubscribe;
  }, [dados, form]);

  const alteraNome = useMutation(
    trpc.embarquesConfigurar.patchNomeItem.mutationOptions({
      onMutate: async (dados) => {
        await queryClient.cancelQueries(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
        );
        const previousData = queryClient.getQueryData(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey()
        );
        queryClient.setQueryData(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey(),
          (old: typeof previousData) =>
            old
              ? {
                  ...old,
                  itemsSchema: old.itemsSchema.map((item) =>
                    item.idItem === dados.idItem
                      ? { ...item, Descricao: dados.Descricao }
                      : item
                  ),
                }
              : old
        );
        return { previousData };
      },
      onError: (_error, _updatedEnvio, context) => {
        toast.error("Erro inesperado ao alterar est item:", {
          description:
            _error instanceof Error ? _error.message : "Erro desconhecido",
        });
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey(),
            context.previousData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
        );
      },
      onSuccess: () => {
        setBotaoIsloading(false);
        setBotaoAlteraItemDisabled(true);
        router.push("/dashboard/embarques/configurar?tipo=ac");
      },
    })
  );
  async function onSubmit(values: PatchItemSchemaDto) {
    setBotaoIsloading(true);
    alteraNome.mutate(values);
  }

  const apagaItem = useMutation(
    trpc.embarquesConfigurar.apagaItem.mutationOptions({
      onMutate: async (dados) => {
        await queryClient.cancelQueries(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
        );
        const previousData = queryClient.getQueryData(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey()
        );
        queryClient.setQueryData(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey(),
          (old: typeof previousData) =>
            old
              ? {
                  ...old,
                  itemsSchema: old.itemsSchema.filter(
                    (item) => item.idItem !== dados.id
                  ),
                }
              : old
        );
        return { previousData };
      },
      onError: (_error, _updatedEnvio, context) => {
        toast.error("Erro inesperado apagar item:", {
          description:
            _error instanceof Error ? _error.message : "Erro desconhecido",
        });
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.embarquesConfigurar.getDestinosDisponiveis.queryKey(),
            context.previousData
          );
        }
      },
      onSettled: () => {
        setBotaoIsloading(false);
        setBotaoAlteraItemDisabled(true);
        queryClient.invalidateQueries(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
        );
        router.push("/dashboard/embarques/configurar?tipo=ac");
      },
    })
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto w-full max-w-fit">
          <CardHeader>
            <CardTitle className="">Altera Item...</CardTitle>
            <CardDescription>{`Id do item: ${dados.idItem}`}</CardDescription>
          </CardHeader>
          <CardContent className="">
            <FormField
              control={form.control}
              name="Descricao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-auto min-w-96 border-none"
                      placeholder="Nome em Pt..."
                      {...field}
                    />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descItem"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-auto min-w-96 border-none"
                      placeholder="Nome em Fr..."
                      {...field}
                    />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex w-full">
              <Button
                disabled={botaoAlteraItemDisabled || botaoIsloading}
                className="mx-auto"
                type="submit"
              >
                {botaoIsloading && <Loader2 className="animate-spin" />}
                Alterar Item
              </Button>
              <Button
                className="mx-auto"
                disabled={botaoIsloading}
                type="button"
                onClick={() => {
                  setBotaoIsloading(true);
                  apagaItem.mutate({ id: dados.idItem });
                }}
              >
                {botaoIsloading && <Loader2 className="animate-spin" />}
                Apaga Item
              </Button>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default FormAlteraItemExistent;
