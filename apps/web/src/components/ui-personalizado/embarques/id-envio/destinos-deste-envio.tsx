"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import {
  PostDestinoSchema,
  PostDestinoSchemaDto,
} from "@repo/tipos/embarques_idenvio";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import WrapperEscolheDestino from "../wrapper-escolhe-destino";

import { Form } from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";

type DestinosDesteEnvioProps = {
  idEnvio: number;
  idDestino: string;
};

const DestinosDesteEnvio = ({
  idEnvio,
  idDestino,
}: DestinosDesteEnvioProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [destino, setDestino] = useState<PostDestinoSchemaDto>({
    idEnvio,
    idDestino,
  });

  const form = useForm<PostDestinoSchemaDto>({
    resolver: zodResolver(PostDestinoSchema),
    defaultValues: {
      idEnvio,
      idDestino,
    },
  });

  const alteraDestino = useMutation(
    trpc.embarquesIdEnvio.patchFornecedor.mutationOptions({
      onMutate: async (updatedDestino) => {
        await queryClient.cancelQueries(
          trpc.embarquesIdEnvio.getEnvio.queryOptions({ id: idEnvio })
        );

        const previousData = queryClient.getQueryData(
          trpc.embarquesIdEnvio.getEnvio.queryKey({ id: idEnvio })
        );

        queryClient.setQueryData(
          trpc.embarquesIdEnvio.getEnvio.queryKey({ id: idEnvio }),
          (
            old:
              | {
                  Destinos: {
                    idIdioma: number;
                    idDestino: string;
                    nomeDestino: string;
                    morada: string;
                    localMorada: string;
                    codigoPostal: string;
                    nacionalidade: string;
                  };
                  idEnvio: number;
                  nomeEnvio: string;
                  obs: string | null;
                }
              | null
              | undefined
          ) =>
            old
              ? {
                  ...old,
                  Destinos: {
                    ...old.Destinos,
                    idDestino: updatedDestino.idDestino,
                  },
                }
              : old
        );

        return { previousData };
      },

      onError: (_error, _updatedEnvio, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.embarquesIdEnvio.getEnvio.queryKey({ id: idEnvio }),
            context.previousData
          );
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.embarquesIdEnvio.getEnvio.queryOptions({ id: idEnvio })
        );
      },
      onSuccess: (_data, updatedDestino) => {
        queryClient
          .getQueryCache()
          .findAll()
          .forEach((query) => {
            const queryKey = query.queryKey;

            if (
              Array.isArray(queryKey) &&
              Array.isArray(queryKey[0]) &&
              queryKey[0][0] === "getEnviosAcessorios" &&
              typeof queryKey[1] === "object" &&
              queryKey[1] !== null &&
              "input" in queryKey[1]
            ) {
              const input = queryKey[1]
                .input as DadosParaPesquisaComPaginacaoEOrdemDto;

              const cachedData = queryClient.getQueryData(
                trpc.embarques.getEnviosAcessorios.queryKey(input)
              );

              const devoFazerReset = cachedData?.lista.some(
                (dados) =>
                  dados.idEnvio === idEnvio &&
                  dados.Destinos.idDestino !== updatedDestino.idDestino
              );
              if (devoFazerReset)
                queryClient.resetQueries(
                  trpc.embarques.getEnviosAcessorios.queryOptions(input)
                );
            }
          });
      },
    })
  );

  const isSaving = alteraDestino.isPending;
  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = PostDestinoSchema.safeParse(values);
      if (!isValid.success) return;

      if (values.idDestino !== destino.idDestino && values.idDestino)
        alteraDestino.mutate({ idEnvio: idEnvio, idDestino: values.idDestino });

      setDestino((prev) => ({
        ...prev,
        idDestino: values.idDestino ?? prev.idDestino,
      }));
    });
    return unsubscribe;
  }, [alteraDestino, destino.idDestino, form, idEnvio, queryClient]);

  return (
    <Form {...form}>
      <form>
        <WrapperEscolheDestino
          form={form}
          name="idDestino"
          isSaving={isSaving}
        />
      </form>
    </Form>
  );
};

export default DestinosDesteEnvio;
