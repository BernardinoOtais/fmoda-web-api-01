"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PostNovoEnvioSchema,
  PostNovoEnvioSchemaDto,
} from "@repo/tipos/embarques";
import { ClipboardPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import WrapperEscolheDestino from "@/components/ui-personalizado/embarques/wrapper-escolhe-destino";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@repo/trpc";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";

type NovoEnvioProps = {
  aberto?: boolean;
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
};

const NovoEnvio = ({ aberto, dadosIniciais }: NovoEnvioProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const novoEnvioOuPatch = useMutation(
    trpc.posPatchEnvio.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.getEnviosAcessorios.queryOptions({ ...dadosIniciais })
        );
        if (data === "Erro ao validar Nome do utilizador")
          return toast.error(data);
        const idEnvio = data.idEnvio;
        if (idEnvio) {
          router.push(`/dashboard/embarques/${idEnvio}`);
        } else {
          toast.warning("Envio inserido, mas sem ID retornado.");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const [open, setOpen] = useState(aberto || false);

  const router = useRouter();

  const [disabledBotao, setDisabledBotao] = useState(true);

  const form = useForm<PostNovoEnvioSchemaDto>({
    resolver: zodResolver(PostNovoEnvioSchema),
    defaultValues: {
      nomeEnvio: "",
      obs: "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      setDisabledBotao(true);

      const isValid = PostNovoEnvioSchema.safeParse(values);
      if (!isValid.success) return;
      setDisabledBotao(false);
    });
    return unsubscribe;
  }, [form]);

  async function onSubmit(values: PostNovoEnvioSchemaDto) {
    setDisabledBotao(true);

    novoEnvioOuPatch.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!open && (
        <DialogTrigger asChild>
          <Button
            size="icon"
            className={cn(
              "relative flex items-center justify-center" // Default classes
            )}
            title="Novo envio"
          >
            <ClipboardPlus />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Envio</DialogTitle>
          <DialogDescription>Criar novo envio</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <WrapperEscolheDestino
                form={form}
                name="idDestino"
                label="Destino"
              />

              <FormField
                control={form.control}
                name="nomeEnvio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Envio</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome Envio..." {...field} />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="obs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Obs</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Obs..." {...field} />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={disabledBotao} type="submit">
                  Novo Envio
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoEnvio;
