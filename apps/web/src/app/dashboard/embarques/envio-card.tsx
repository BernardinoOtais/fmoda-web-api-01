import { zodResolver } from "@hookform/resolvers/zod";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import {
  EnvioDto,
  EnviosListDto,
  PostNovoEnvioSchema,
  PostNovoEnvioSchemaDto,
} from "@repo/tipos/embarques";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import BotaoApagaEnvio from "./botao-apaga-envio";

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
import { Textarea } from "@/components/ui/textarea";
import WrapperEscolheDestino from "@/components/ui-personalizado/embarques/wrapper-escolhe-destino";
import { useTRPC } from "@/trpc/client";

type EnvioCardProps = {
  envio: EnvioDto;
  disabledBotao: boolean;
  setDisabledBotao: (data: boolean) => void;
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
};
const EnvioCard = ({
  envio,
  disabledBotao,
  setDisabledBotao,
  dadosIniciais,
}: EnvioCardProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const novoEnvioOuPatch = useMutation(
    trpc.embarques.posPatchEnvio.mutationOptions({
      onMutate: async (updatedEnvio) => {
        await queryClient.cancelQueries(
          trpc.embarques.getEnviosAcessorios.queryOptions(dadosIniciais)
        );

        const previousData = queryClient.getQueryData<EnviosListDto>(
          trpc.embarques.getEnviosAcessorios.queryKey(dadosIniciais)
        );

        if (!previousData) return { previousData: null };

        queryClient.setQueryData(
          trpc.embarques.getEnviosAcessorios.queryKey(dadosIniciais),
          {
            ...previousData,
            lista: previousData.lista.map((envio) =>
              envio.idEnvio === updatedEnvio.idEnvio
                ? { ...envio, ...updatedEnvio }
                : envio
            ),
          }
        );

        return { previousData };
      },

      onError: (_error, _updatedEnvio, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.embarques.getEnviosAcessorios.queryKey(dadosIniciais),
            context.previousData
          );
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.embarques.getEnviosAcessorios.queryOptions(dadosIniciais)
        );
      },
    })
  );

  const [estadoOriginal, setEstadoOriginal] = useState({
    nomeEnvio: envio.nomeEnvio,
    idEnvio: envio.idEnvio,
    idDestino: envio.Destinos.idDestino,
    obs: envio.obs || "",
  });

  const [botaoEscondido, setBotaEscondido] = useState(true);
  const [botaoAlteraIsloading, setBotaoAlteraIsloading] = useState(false);

  const form = useForm<PostNovoEnvioSchemaDto>({
    resolver: zodResolver(PostNovoEnvioSchema),
    defaultValues: estadoOriginal,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setBotaEscondido(true);

      const valoreDoFormVerificados = PostNovoEnvioSchema.safeParse(values);
      if (!valoreDoFormVerificados.success) {
        return;
      }

      const valoresNoFormEmString = JSON.stringify(values);
      const dadosOriginaisEmString = JSON.stringify(estadoOriginal);

      if (valoresNoFormEmString === dadosOriginaisEmString) return;

      setBotaEscondido(false);
    });

    return () => subscription.unsubscribe();
  }, [estadoOriginal, form]);

  async function onSubmit(values: PostNovoEnvioSchemaDto) {
    setBotaoAlteraIsloading(true);

    try {
      const resultado = await novoEnvioOuPatch.mutateAsync(values);

      if (resultado === "Erro ao validar Nome do utilizador") {
        toast.error(`Erro ao alterar Envio...`, {
          description: resultado,
        });
        form.reset();
      } else {
        toast.info("Alterado correctamente...", {
          description: "Sucesso",
        });
        setEstadoOriginal({
          nomeEnvio: values.nomeEnvio,
          idEnvio: envio.idEnvio,
          idDestino: values.idDestino,
          obs: values.obs || "",
        });
      }
    } catch (error) {
      console.error("Erro inesperado ao alterar envio:", error);
      toast.error("Erro inesperado ao alterar envio", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setBotaoAlteraIsloading(false);
      setBotaEscondido(true);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="">
          <CardHeader>
            <CardTitle className="text-center">
              <FormField
                control={form.control}
                name="nomeEnvio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-none text-center font-bold md:text-2xl"
                        placeholder="Nome Envio..."
                        {...field}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </CardTitle>
            <CardDescription>{`Envio criado em ${envio.createdAt.toLocaleDateString("en-GB")}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1">
              <div className="flex flex-col items-center space-x-2 md:flex-row">
                <Button asChild variant="link">
                  <Link
                    className="text-center"
                    href={{
                      pathname: `/dashboard/embarques/${envio.idEnvio}`,
                    }}
                  >{`Envio: ${envio.idEnvio}`}</Link>
                </Button>

                <WrapperEscolheDestino
                  form={form}
                  name="idDestino"
                  largura="w-[400px] md:w-[450px]"
                />
              </div>
              <FormField
                control={form.control}
                name="obs"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Textarea placeholder="Obs..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {!botaoEscondido && (
                <Button>
                  {botaoAlteraIsloading && <Loader2 className="animate-spin" />}
                  Alterar Envio
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="mr-auto">{`Envio criado por: ${envio.nomeUser}`}</p>
            {envio._count?.Container === 0 && (
              <BotaoApagaEnvio
                idenvio={envio.idEnvio}
                disabledBotao={disabledBotao}
                setDisabledBotao={setDisabledBotao}
                dadosIniciais={dadosIniciais}
              />
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EnvioCard;
