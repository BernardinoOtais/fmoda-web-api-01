"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutocompleteDto } from "@repo/tipos/comuns";
import {
  ContainerOpsSchemasDto,
  OpSchemaDto,
  PostConteudoDto,
  PostConteudoSchema,
} from "@repo/tipos/embarques_idenvio";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AutoCompleteFormField } from "@/components/ui-personalizado/meus-components/AutoCompleteFormField";
import { SelectFormField } from "@/components/ui-personalizado/meus-components/select-form-fiels";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type InserConteudoClienteProps = {
  idEnvio: number;
  idConteudo?: number;
  idContainer: number;
  ops: AutocompleteDto[];
  unidades: AutocompleteDto[];
  itens: AutocompleteDto[];
  dadoOps: ContainerOpsSchemasDto;
};

type DadosOp = { modelo: string; cor: string; pedido: string };

const InserConteudoCliente = ({
  idEnvio,
  idContainer,
  ops,
  unidades,
  itens,
  dadoOps,
}: InserConteudoClienteProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [estadoBoataoSubmitDisabled, setEstadoBoataoSubmitDisabled] =
    useState(true);
  const [dadosOp, setDadosOp] = useState<DadosOp>({
    modelo: "",
    cor: "",
    pedido: "",
  });
  const [tamanhoUnico, setTamanhoUnico] = useState(true);
  const form = useForm<PostConteudoDto>({
    resolver: zodResolver(PostConteudoSchema),
    defaultValues: {
      idEnvio,
      conteudo: {
        idContainer,
        idUnidades: 1, //Unidades
      },
    },
  });
  const { getValues, setValue, watch, reset, control } = form;

  useEffect(() => {
    const { unsubscribe } = watch(async (values, { name }) => {
      setEstadoBoataoSubmitDisabled(true);
      if (name === "conteudo.op") {
        const opSelecionado = values.conteudo?.op;

        const dados = opSelecionado
          ? dadoOps?.find((op) => op.op === opSelecionado)?.Op
          : undefined;

        if (dados) {
          setValue(
            "conteudo.TamanhosQttPeso",
            tamanhoUnico
              ? [{ tam: "nt", qtt: 0, peso: 0, pesoUnit: 0 }]
              : getTamanhos(dados)
          );
          setDadosOp({
            modelo: dados.modelo,
            cor: dados.cor.trim(),
            pedido: dados.pedido,
          });
        }
      }
      const isValid = PostConteudoSchema.safeParse(values);
      if (!isValid.success) return;

      setEstadoBoataoSubmitDisabled(false);
    });

    return unsubscribe;
  }, [dadoOps, setValue, tamanhoUnico, watch]);

  useEffect(() => {
    const values = getValues(); // from react-hook-form

    const opSelecionado = values.conteudo?.op;
    const dados = opSelecionado
      ? dadoOps?.find((op) => op.op === opSelecionado)?.Op
      : undefined;

    if (dados) {
      setValue(
        "conteudo.TamanhosQttPeso",
        tamanhoUnico
          ? [{ tam: "nt", qtt: 0, peso: 0, pesoUnit: 0 }]
          : getTamanhos(dados)
      );
      setDadosOp({
        modelo: dados.modelo,
        cor: dados.cor.trim(),
        pedido: dados.pedido,
      });
    }

    const isValid = PostConteudoSchema.safeParse(values);
    setEstadoBoataoSubmitDisabled(!isValid.success);
  }, [tamanhoUnico, dadoOps, getValues, setValue]);

  const tamanhosQttPeso = getValues("conteudo.TamanhosQttPeso");

  const idItem = watch("conteudo.idItem");

  const postConteudo = useMutation(
    trpc.embarquesIdEnvio.postConteudo.mutationOptions({
      onSuccess: () => {
        toast.info(`Conteudo inserido correctament...`, {
          description: "Sucesso",
        });

        reset();
      },
      onError: (error) => {
        console.error("Erro inesperado ao inserir conteudo:", error);
      },
      onSettled: () => {
        setValue("conteudo.op", 0);

        setDadosOp({
          modelo: "",
          cor: "",
          pedido: "",
        });

        queryClient.invalidateQueries(
          trpc.embarquesIdEnvio.getConteudo.queryOptions({ id: idContainer })
        );

        setEstadoBoataoSubmitDisabled(false);
      },
    })
  );

  async function onSubmit(postConteudoDto: PostConteudoDto) {
    setEstadoBoataoSubmitDisabled(true);
    postConteudo.mutate(postConteudoDto);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto">
        <div className="flex flex-col items-center">
          <SelectFormField
            form={form}
            name="conteudo.op"
            options={ops}
            label="Op"
            placeholder="Op..."
            largura="w-[120px]"
          />
          <div className="mx-auto flex flex-row items-center py-2">
            {dadosOp.modelo && (
              <>
                <span className="mx-1">Mode:</span>
                <p className="font-semibold">{dadosOp.modelo}</p>
                <Separator
                  orientation="vertical"
                  className="mx-2 h-8 w-[2px]"
                />
                <span className="mx-1">Cor:</span>
                <p className="font-semibold">{dadosOp.cor}</p>
                <Separator
                  orientation="vertical"
                  className="mx-2 h-8 w-[2px]"
                />
                <span className="mx-1">Pedido:</span>
                <p className="font-semibold">{dadosOp.pedido}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-1 sm:flex-row sm:items-start">
          <AutoCompleteFormField
            form={form}
            name="conteudo.idItem"
            options={itens}
            label="Item"
            placeholder="Selecione um item..."
            largura="w-[400px]"
          />

          <SelectFormField
            form={form}
            name="conteudo.idUnidades"
            options={unidades}
            label="Unidade"
            placeholder="Unidade..."
            largura="w-[120px]"
          />
        </div>
        <div className="flex flex-col" id="quantidades-tamanhos-pesos">
          <div className="mx-auto flex items-center space-x-2">
            <Switch
              id="tamanho-unico"
              checked={tamanhoUnico}
              onCheckedChange={setTamanhoUnico}
              disabled={!tamanhosQttPeso || !idItem}
            />
            <Label htmlFor="tamanho-unico">Tamanho único</Label>
          </div>

          <div className="mx-auto mt-4">
            {tamanhosQttPeso?.map((tamanho, index) => (
              <div key={tamanho.tam} className="flex items-start space-x-4">
                {tamanho.tam !== "nt" && (
                  <span
                    className={cn(
                      "mt-[6px] w-12 text-end font-semibold",
                      index === 0 ? "mt-[31px]" : ""
                    )}
                  >
                    {`${tamanho.tam} :`}
                  </span>
                )}
                <FormField
                  control={control}
                  name={`conteudo.TamanhosQttPeso.${index}.qtt`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Qtt</FormLabel>}
                      <FormControl>
                        <Input
                          placeholder="qtt.."
                          {...field}
                          onKeyDown={(e) =>
                            handleArrowNavigation(
                              e,
                              index,
                              "qtt",
                              tamanhosQttPeso.length
                            )
                          }
                        />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`conteudo.TamanhosQttPeso.${index}.peso`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Peso T</FormLabel>}
                      <FormControl>
                        <Input
                          placeholder="peso..."
                          {...field}
                          onKeyDown={(e) =>
                            handleArrowNavigation(
                              e,
                              index,
                              "peso",
                              tamanhosQttPeso.length
                            )
                          }
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
                  name={`conteudo.TamanhosQttPeso.${index}.pesoUnit`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Peso U</FormLabel>}
                      <FormControl>
                        <Input
                          placeholder="peso..."
                          {...field}
                          onKeyDown={(e) =>
                            handleArrowNavigation(
                              e,
                              index,
                              "pesoUnit",
                              tamanhosQttPeso.length
                            )
                          }
                        />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            type="submit"
            className="ml-auto"
            disabled={estadoBoataoSubmitDisabled}
          >
            Inserir
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InserConteudoCliente;

const handleArrowNavigation = (
  e: React.KeyboardEvent,
  index: number,
  fieldType: "qtt" | "peso" | "pesoUnit",
  totalRows: number
) => {
  const fieldOrder: ("qtt" | "peso" | "pesoUnit")[] = [
    "qtt",
    "peso",
    "pesoUnit",
  ];
  const currentIndex = fieldOrder.indexOf(fieldType);

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const nextIndex = e.key === "ArrowDown" ? index + 1 : index - 1;
    const nextField = document.querySelector<HTMLInputElement>(
      `input[name="conteudo.TamanhosQttPeso.${nextIndex}.${fieldType}"]`
    );

    if (nextField) {
      nextField.focus();
    }
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    e.preventDefault();
    let nextFieldType: "qtt" | "peso" | "pesoUnit" | null = null;

    if (e.key === "ArrowLeft" && currentIndex > 0) {
      nextFieldType = fieldOrder[currentIndex - 1] ?? null;
    }
    if (e.key === "ArrowRight" && currentIndex < fieldOrder.length - 1) {
      nextFieldType = fieldOrder[currentIndex + 1] ?? null;
    }

    if (nextFieldType) {
      const nextField = document.querySelector<HTMLInputElement>(
        `input[name="conteudo.TamanhosQttPeso.${index}.${nextFieldType}"]`
      );

      if (nextField) {
        nextField.focus();
      }
    }
  }

  if (e.key === "Tab") {
    if (index === totalRows - 1 && fieldType === "pesoUnit") {
      return;
    }

    e.preventDefault();

    const nextIndex = currentIndex < fieldOrder.length - 1 ? index : index + 1;
    const nextFieldType =
      currentIndex < fieldOrder.length - 1
        ? fieldOrder[currentIndex + 1]
        : "qtt";

    const nextField = document.querySelector<HTMLInputElement>(
      `input[name="conteudo.TamanhosQttPeso.${nextIndex}.${nextFieldType}"]`
    );

    if (nextField) {
      nextField.focus();
    }
  }
};

const getTamanhos = (dados: OpSchemaDto) =>
  dados.OpTamanho?.sort((a, b) => a.ordem - b.ordem)
    .filter((item) => item.tam !== "nt")
    .map((item) => ({
      tam: item.tam,
      qtt: 0,
      peso: 0,
      pesoUnit: 0,
    })) ?? [];
